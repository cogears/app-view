import { DataCompareRule } from "types"

export function isNull(value: any, isBlank: boolean = true) {
    let result = value == undefined || value == null
    if (isBlank) {
        result = result || value == ''
    }
    return result
}

export function isPhone(value: string) {
    return /^1\d{10}$/.test(value)
}

export function isEmail(value: string) {
    return /^\w+@\w+(\.\w+)+$/.test(value)
}

export function executeCompare(source: any, target: any, rule: DataCompareRule) {
    if (target instanceof Date) {
        target = new Date(target)
        target.setHours(0)
        target.setMinutes(0)
        target.setSeconds(0)
        target = target.getTime()
    }
    switch (rule) {
        case '=': return source == target
        case '<': return source < target
        case '<=': return source <= target
        case '>': return source > target
        case '>=': return source >= target
        case 'like': return source.indexOf(target) >= 0
        default: return false
    }
}

export function textWidth(text: string) {
    return Math.max((text.length + 1) * 14 + 20, 90)
}

export function removeItemFrom(arr: any[], item: any) {
    let i = arr.indexOf(item)
    if (i >= 0) {
        arr.splice(i, 1)
    }
}