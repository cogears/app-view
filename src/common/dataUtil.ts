export function fetchValue(data: any, key: string) {
    let keys = key.split('.');
    for (let k of keys) {
        data = data[k];
        if (data == undefined || data == null) {
            break
        }
    }
    return data;
}

export function setupValue(data: any, key: string, value: any) {
    let keys = key.split('.');
    let field = keys.pop()
    if (keys.length > 0) {
        data = fetchValue(data, keys.join('.'))
    }
    if (data && field) {
        data[field] = value
    }
}

export function copyValue(obj: any, hash = new WeakMap()) {
    if (obj == null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj);
    if (obj instanceof RegExp) return new RegExp(obj);
    if (hash.has(obj)) return hash.get(obj);

    const cloneObj: any = Array.isArray(obj) ? [] : {};
    hash.set(obj, cloneObj);
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            cloneObj[key] = copyValue(obj[key], hash);
        }
    }
    return cloneObj;
}
