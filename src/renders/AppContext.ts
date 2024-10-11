import { copyValue } from '@/common/dataUtil';
import { HttpOptions } from '@cogears/http-client';
import { AppOptions, AppState, UserState } from 'types';
import { ref } from 'vue';
import { Router } from 'vue-router';
import ViewContext from '../ViewContext';
import DomainApi from './DomainApi';

const ONLINE_SESSION = '__session__'

export default class AppContext extends ViewContext {
    private readonly _app: AppOptions;
    private readonly _domainApis: Record<string, DomainApi> = {}
    private readonly _appState = ref<AppState>({
        name: '', logo: '', background: '',
        user: { id: 0, name: '', token: '' },
    })

    constructor(router: Router, app: AppOptions) {
        super(router)
        this._app = app
        this._appState.value = copyValue(app.state)
        for (let domain of app.apis) {
            this._domainApis[domain.name] = new DomainApi(domain)
        }
    }

    get appState() {
        return this._appState.value
    }

    get appNavigators() {
        return this._app.navigators
    }

    get appLogin() {
        return this._app.loginTransaction
    }

    get appUpload() {
        return this._app.uploadTransaction
    }

    isOnline() {
        let text = sessionStorage.getItem(ONLINE_SESSION)
        if (text) {
            this.appState.user = JSON.parse(text)
        }
        return this.appState.user.id
    }

    setOnline(user?: UserState) {
        if (user) {
            this.appState.user = user
            sessionStorage.setItem(ONLINE_SESSION, JSON.stringify(user))
        } else {
            this.appState.user = { id: 0, name: '', token: '' }
            sessionStorage.removeItem(ONLINE_SESSION)
        }
    }

    async submitRequest<T>(key: string, options: HttpOptions = {}): Promise<T> {
        let [domain, api] = key.split('.')
        if (this._domainApis[domain]) {
            try {
                return await this._domainApis[domain].request(api, options, this.appState)
            } catch (e: any) {
                if (e.code == 401) {
                    this.setOnline()
                } else {
                    this.device.toast(e.message)
                }
                throw e
            }
        }
        throw new Error(`DomainApi ${key} not found`)
    }
}