export function isHttpMode(): boolean {
    return window.location.protocol == 'http:' || window.location.protocol == 'https:'
}
export function isFileMode(): boolean {
    return window.location.protocol == 'file:'
}

export function getQuery(search?: string): Record<string, string> {
    if (!search) {
        search = window.location.search
    }
    let query: any = {}
    let pairs = search.substring(1).split('&').map(s => s.split('='))
    for (let ks of pairs) {
        if (ks[0]) {
            query[ks[0]] = ks[1]
        }
    }
    return query
}

export function registerResizeEvent(target: HTMLElement, listener: (rect: DOMRectReadOnly) => void): () => void {
    const resizeObserver = new ResizeObserver(entries => {
        listener(entries[0].contentRect)
    })
    resizeObserver.observe(target)

    return function () {
        resizeObserver.disconnect()
    }
}

export class WebCache {
    readonly persistence: boolean
    private localCache: any = {}

    constructor(persistence: boolean = false) {
        this.persistence = persistence
    }

    get deviceCache() {
        return this.persistence ? window.localStorage : window.sessionStorage
    }

    getItem(key: string, json: boolean = false) {
        if (!this.localCache[key]) {
            let text = this.deviceCache.getItem(key)
            if (text) {
                if (json) {
                    try {
                        this.localCache[key] = JSON.parse(text)
                    } catch (e) { }
                } else {
                    this.localCache[key] = text
                }
            }
        }
        return this.localCache[key]
    }

    setItem(key: string, value: any, json: boolean = false) {
        this.localCache[key] = value
        if (json) {
            value = JSON.stringify(value)
        }
        this.deviceCache.setItem(key, value)
    }

    removeItem(key: string) {
        delete this.localCache[key]
        this.deviceCache.removeItem(key)
    }

    clear() {
        this.deviceCache.clear()
        this.localCache = {}
    }
}