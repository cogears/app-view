import { fetchValue } from "./dataUtil";
function n2(value: number): string {
    return value < 10 ? '0' + value : value + ''
}

function renderDate(date: Date, format: string): string {
    return format.replace(/\{YYYY\}/g, date.getFullYear() + '')
        .replace(/\{YY\}/g, (date.getFullYear() + '').substring(2))
        .replace(/\{MM\}/g, n2(date.getMonth() + 1))
        .replace(/\{DD\}/g, n2(date.getDate()))
        .replace(/\{hh\}/g, n2(date.getHours()))
        .replace(/\{mm\}/g, n2(date.getMinutes()))
        .replace(/\{ss\}/g, n2(date.getSeconds()))
}

function date(value: any, format: string = '{YYYY}-{MM}-{DD}') {
    if (value) {
        return renderDate(new Date(+value), format);
    } else {
        return '--'
    }
}

function time(value: any, format: string = '{hh}:{mm}:{ss}') {
    if (value) {
        return renderDate(new Date(+value), format);
    } else {
        return '--'
    }
}

function datetime(value: any, format: string = '{YYYY}-{MM}-{DD} {hh}:{mm}:{ss}') {
    if (value) {
        return renderDate(new Date(+value), format);
    } else {
        return '--'
    }
}

const WEEK = ['周日', '周一', '周二', '周三', '周四', '周五', '周六',]
function week(value: any) {
    if (value) {
        let dt = new Date(+value);
        return WEEK[dt.getDay()];
    } else {
        return '--'
    }
}

function cold(seconds: number) {
    seconds = Math.floor(seconds);
    let minutes = Math.floor(seconds / 60)
    seconds = seconds % 60
    let hours = Math.floor(minutes / 60)
    minutes = minutes % 60
    let days = Math.floor(hours / 24)
    hours = hours % 24
    let str = n2(minutes) + ':' + n2(seconds)
    if (days > 0) {
        str = days + '天' + n2(hours) + ':' + str
    } else if (hours > 0) {
        str = n2(hours) + ':' + str
    }
    return str
}

function number(value: number, fractionDigits: number = 2, symbol: boolean = false) {
    if (value === undefined || value === null || isNaN(value) || value == Infinity) {
        return '--'
    } else {
        let prefix = '';
        if (symbol) {
            prefix = value > 0 ? '+' : '';
        }
        return prefix + value.toFixed(fractionDigits)
    }
}

function percent(value: number, fractionDigits: number = 2, symbol: boolean = false) {
    if (value === undefined || value === null || isNaN(value) || value == Infinity) {
        return '--'
    } else {
        let prefix = ''
        if (symbol) {
            prefix = value > 0 ? '+' : ''
        }
        return prefix + (value * 100).toFixed(fractionDigits) + '%'
    }
}

function amount(value: number, fractionDigits: number = 2, symbol: boolean = false) {
    if (value === undefined || value === null || isNaN(value)) {
        return '--'
    } else {
        let [left, right] = value.toFixed(fractionDigits).split('.')
        let arr = []
        let i = left.length;
        while (i-- > 0) {
            if (left[i] != '-') {
                if (arr.length % 4 == 3) {
                    arr.unshift(',')
                }
            }
            arr.unshift(left[i]);
        }
        let prefix = ''
        if (symbol) {
            prefix = value > 0 ? '+' : ''
        }
        let suffix = ''
        if (fractionDigits > 0) {
            suffix = '.' + right
        }
        return prefix + arr.join('') + suffix
    }
}

function unit(value: number, fractionDigits: number = 2, symbol: boolean = false) {
    if (value === undefined || value === null || isNaN(value)) {
        return '--'
    } else {
        let prefix = '';
        if (value != 0) {
            prefix = value < 0 ? '-' : '+';
        }
        if (!symbol && prefix == '+') {
            prefix = ''
        }
        value = Math.abs(value);
        if (value >= 10000) {
            let suffix = '万'
            value = value / 10000
            if (value >= 10000) {
                value = value / 10000
                suffix = '亿'
                if (value >= 10000) {
                    value = value / 10000;
                    suffix = '万亿'
                }
            }
            return prefix + value.toFixed(fractionDigits) + suffix
        } else {
            return prefix + value.toFixed(0)
        }
    }
}

function fileSize(value: number) {
    if (value === undefined || value === null || isNaN(value)) {
        return '--'
    } else {
        if (value > 1024) {
            value = value / 1024
            if (value > 1024) {
                value = value / 1024
                return value.toFixed(2) + 'MB'
            } else {
                return value.toFixed(2) + 'KB'
            }
        } else {
            return value + 'B'
        }
    }
}

function mask(value: string) {
    if (!value) {
        return '--'
    }
    return value.substring(0, 3) + '****' + value.substring(value.length - 4);
}

function text(template: string, env: any, nullReplace?: string) {
    return template.replace(/\${.+?}/g, (match: string) => {
        let key = match.substring(2, match.length - 1)
        let val = fetchValue(env, key)
        if (val == undefined || val == null) {
            return nullReplace || match
        } else {
            return val
        }
    })
}

export default {
    n2,
    date, time, datetime, week, cold,
    number, percent, amount, unit, fileSize,
    mask,
    text,
}