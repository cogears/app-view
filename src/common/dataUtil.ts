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

export function copyValue(source: any) {
    return JSON.parse(JSON.stringify(source))
}