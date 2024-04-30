import { fetchValue } from "../common/dataUtil"

export interface IInput {
    focus(): void
    blur(): void
}

export interface IScroller {
    scroll(offX: number, offY: number): void
    scrollTo(x: number, y: number, options?: { immediately?: boolean, position?: 'fixed' | 'absolute' }): void
}

export interface ScrollEvent {
    width: number,
    height: number,
    x: number,
    y: number,
    percentX: number,
    percentY: number,
}

export interface Option {
    key: any,
    label: string,
    [index: string]: any
}

export interface MenuOption extends Option {
    selected?: boolean,
    disabled?: boolean,
    children?: MenuOption[]
}


export interface Column {
    label: string,
    key: string,
    width: number,
    widthFixed?: boolean,
    render?: (value: any, c: Column, item: any) => any,
    format?: string,
    formatArgs?: Array<any>,
    fixed?: boolean,
    suffix?: boolean,
    classNames?: string | ((value: any, c: Column, item: any) => string[]),
    align?: 'left' | 'center' | 'right',
    bold?: boolean,
    sort?: 'asc' | 'desc' | 'none',
    orderBy?: string,
    bgClass?: string,
    __attachment?: any,
}

export interface ColumnHeader {
    label: string,
    from: number,
    to: number,
    bgClass?: string,
    children?: ColumnHeader[]
}

export function sort(list: any[], column: Column) {
    list.sort((item0, item1) => {
        let v0 = fetchValue(item0, column.key);
        let v1 = fetchValue(item1, column.key);
        return sortCompute(v0, v1, item0, item1, column)
    })
}

export function sortCompute(v0: any, v1: any, item0: any, item1: any, column: Column) {
    if (v1 === undefined || v1 === null || v1 === '') {
        return -1
    }
    if (v0 === undefined || v0 === null || v0 === '') {
        return 1
    }
    if (v0 == v1 && item0.__no && item1.__no) {
        let id0 = item0.__no
        let id1 = item1.__no
        return column.sort == 'asc' ? id0 - id1 : id1 - id0
    }
    if (column.sort == 'asc') {
        return v0 < v1 ? -1 : 1
    } else {
        return v0 > v1 ? -1 : 1
    }
}