export function isNumberValid(value?: number) {
    return value != undefined && value != null && !isNaN(value) && typeof value == 'number'
}

export function n2(value: number): string {
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

export function date(value: any, format: string = '{YYYY}-{MM}-{DD}') {
    if (value) {
        return renderDate(new Date(+value), format);
    } else {
        return '--'
    }
}

export function time(value: any, format: string = '{hh}:{mm}:{ss}') {
    if (value) {
        return renderDate(new Date(+value), format);
    } else {
        return '--'
    }
}

export function datetime(value: any, format: string = '{YYYY}-{MM}-{DD} {hh}:{mm}:{ss}') {
    if (value) {
        return renderDate(new Date(+value), format);
    } else {
        return '--'
    }
}

export function timebefore(value: number, hour1: boolean = false) {
    if (value) {
        if (hour1) {
            let minutes = Math.floor((Date.now() - value) / 60000);
            if (minutes < 60) {
                return (minutes < 1 ? 1 : minutes) + '分钟前'
            }
        }
        let dt = new Date(+value);
        let now = new Date();
        if (dt.getFullYear() == now.getFullYear()) {
            if (dt.getMonth() == now.getMonth() && dt.getDate() == now.getDate()) {
                return renderDate(dt, '今天 {hh}:{mm}');
            } else {
                return renderDate(dt, '{MM}-{DD} {hh}:{mm}');
            }
        } else {
            return renderDate(dt, '{YYYY}-{MM}-{DD} {hh}:{mm}');
        }
    } else {
        return '--'
    }
}

const WEEK = ['周日', '周一', '周二', '周三', '周四', '周五', '周六',]
export function week(value: any) {
    if (value) {
        let dt = new Date(+value);
        return WEEK[dt.getDay()];
    } else {
        return '--'
    }
}

export function cold(seconds: number) {
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

export function num(value: number | string, fractionDigits: number = 2, symbol: boolean = false, withArrow: boolean = false) {
    if (typeof value == 'string') {
        value = parseFloat(value)
    }
    if (value === undefined || value === null || isNaN(value) || value == Infinity) {
        return '--'
    } else {
        let prefix = '';
        if (symbol) {
            prefix = value > 0 ? '+' : '';
        }
        let suffix = ''
        if (withArrow) {
            suffix = arrow(value)
        }
        return prefix + value.toFixed(fractionDigits) + suffix;
    }
}

export function percent(value: number, fractionDigits: number = 2, symbol: boolean = false, withArrow: boolean = false) {
    if (value === undefined || value === null || isNaN(value) || value == Infinity) {
        return '--'
    } else {
        let prefix = ''
        if (symbol) {
            prefix = value > 0 ? '+' : ''
        }
        let suffix = ''
        if (withArrow) {
            suffix = arrow(value)
        }
        return prefix + (value * 100).toFixed(fractionDigits) + '%' + suffix
    }
}

export function amount(value: number) {
    if (value === undefined || value === null || isNaN(value)) {
        return '--'
    } else {
        let str = value.toFixed(2);
        let arr = []
        let i = str.length;
        while (i-- > 0) {
            if (str[i] != '-') {
                if ((arr.length - 3) % 4 == 3) {
                    arr.unshift(',')
                }
            }
            arr.unshift(str[i]);
        }
        return arr.join('')
    }
}

export function unit(value: number, fractionDigits: number = 2, symbol: boolean = false, withArrow: boolean = false) {
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
        let arrowText = ''
        if (withArrow) {
            arrowText = arrow(value)
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
            return prefix + value.toFixed(fractionDigits) + suffix + arrowText
        } else {
            return prefix + value.toFixed(0) + arrowText
        }
    }
}

export function size(value: number) {
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

export function mask(value: string) {
    if (!value) {
        return '--'
    }
    return value.substring(0, 3) + '****' + value.substring(value.length - 4);
}

export function arrow(value: number) {
    if (value > 0) {
        return '↑'
    } else if (value < 0) {
        return '↓'
    } else {
        return ''
    }
}

export function bg(url: string) {
    return {
        'background-size': 'cover',
        'background-position': 'center center',
        'background-image': 'url(' + url + ')'
    }
}

export function execute(format: string, value: any, ...args: any[]) {
    let filters: { [index: string]: Function } = {
        num,
        percent,
        unit,
        date,
        datetime,
    }
    if (filters[format]) {
        return filters[format](value, ...args)
    } else {
        return value
    }
}