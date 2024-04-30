
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