import formatter from '@/common/formatter';
import { HttpApi, HttpOptions } from '@cogears/http-client';
import { Api, ApiDataMap, ApiDomain } from 'types';

const http = new HttpApi()
function clearBlank(data: any) {
    for (let k in data) {
        if (data[k] == undefined || data[k] == null) {
            delete data[k]
        }
    }
    return data
}

export default class DomainApi {
    private readonly domain: ApiDomain;
    constructor(domain: ApiDomain) {
        this.domain = domain
    }

    preUrl(options: HttpOptions, api: Api): string {
        return this.domain.origin + formatter.text(api.url, options.query)
    }

    preRequest(options: HttpOptions, api: Api, appState: any): HttpOptions {
        let headers: any = {}
        if (api.headers) {
            for (let k in api.headers) {
                headers[k] = formatter.text(api.headers[k], appState)
            }
        }
        if (this.domain.headers) {
            for (let k in this.domain.headers) {
                headers[k] = formatter.text(this.domain.headers[k], appState)
            }
        }
        options.headers = Object.assign(clearBlank(headers), options.headers)
        options.query = Object.assign({}, api.query, clearBlank(options.query), this.domain.query)
        if (options.body) {
            options.body = HttpApi.json(options.body)
        }
        return options
    }

    postRequest(response: any): any {
        if (this.domain.validate) {
            if (this.domain.validate.value != response[this.domain.validate.key] + '') {
                throw new Error(response[this.domain.validate.error])
            }
        }
        return this.domain.result ? response[this.domain.result] : response
    }

    parseDataMap(data: any, map: ApiDataMap | ApiDataMap[]) {
        if (map instanceof Array) {
            let obj: any = {}
            for (let field of map) {
                obj[field.rename || field.key] = this.parseDataMapItem(data, field)
            }
            return obj
        } else {
            return this.parseDataMapItem(data, map)
        }
    }

    parseDataMapItem(data: any, map: ApiDataMap) {
        data = data[map.key]
        if (map.map) {
            if (map.type == 'array') {
                const arr: any[] = []
                if (data instanceof Array) {
                    for (let item of data) {
                        arr.push(this.parseDataMap(item, map.map))
                    }
                }
                data = arr
            } else {
                data = this.parseDataMap(data, map.map)
            }
        }
        if (map.type == 'string') {
            data = data + ''
        }
        return data
    }

    async request(name: string, options: HttpOptions, appState: any): Promise<any> {
        let api = this.domain.apis.find(item => item.name == name)
        if (api) {
            options = this.preRequest(options, api, appState)
            let url = this.preUrl(options, api)
            let data = await http.request(api.method, url, options)
            data = this.postRequest(data)
            if (api.map) {
                data = this.parseDataMap(data, api.map)
            }
            return data
        } else {
            throw new Error(`not found api:${name} in ${this.domain.name}(${this.domain.origin})`)
        }
    }
}

