import { Component, DefineComponent, Prop, PropType } from 'vue'
export interface IDataTable {
    clearSelected(): void
}
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

export interface Option<T> {
    key: T,
    label: string,
}

export interface MenuOption<T> extends Option<T> {
    selected?: boolean,
    disabled?: boolean,
    children?: MenuOption<T>[]
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
}

export interface ColumnHeader {
    label: string,
    from: number,
    to: number,
    bgClass?: string,
    children?: ColumnHeader[]
}

export interface UploadFileItem {
    name: string, url: string, width: number, height: number, duration: number, size: number
}

export type Color = 'blue' | 'red' | 'green' | 'orange' | 'yellow' | 'purple' | 'magenta' | 'cyan' | 'gray' | 'text1' | 'text2' | 'text3' | string

export const Accordion: DefineComponent<{
    options: Option<T>[]
    value: T
}, {}, {}, {}, {}, {}, {}, {
    'update:value': (value: T) => void
    change: () => void
}>

export const Button: DefineComponent<{
    color?: Color
    theme?: 'normal' | 'line'
    round?: boolean,
    on?: boolean,
    readonly?: boolean,
    disabled?: boolean,
    loading?: boolean,
}, {}, {}, {}, {}, {}, {}, {
    click: (e: MouseEvent) => void;
}>

export const Calendar: DefineComponent<{
    value?: Date,
    format?: string,
    placeholder?: string,
    readonly?: boolean,
    disabled?: boolean,
    frameless?: boolean,
}, {}, {}, {}, {}, {}, {}, {
    'update:value': (value: Date) => void
    change: () => void
}>

export const Checkbox: DefineComponent<{
    value?: any,
    selected: Array<any> | boolean,
    disabled?: boolean,
    readonly?: boolean,
}, {}, {}, {}, {}, {}, {}, {
    'update:selected': (value: any) => void
    change: () => void
}>

export const Combobox: DefineComponent<{
    options: MenuOption<any>[],
    value: any | any[],
    placeholder?: string,
    disabled?: boolean,
    readonly?: boolean,
    frameless?: boolean,
    multiple?: boolean,
    inputMode?: boolean,
    clearVisible?: boolean,
}, {}, {}, {}, {}, {}, {}, {
    'update:value': (value: any | any[]) => void
    change: () => void
}>

export const DataTable: DefineComponent<{
    data: any[],
    columns: Column[],
    headers?: ColumnHeader[],
    border?: boolean,
    full?: boolean,
    big?: boolean,
    serial?: boolean,
    loading?: boolean,
    selectable?: boolean,
    defaultSelectedIndex?: number,
    drag?: boolean,
    sort?: boolean,
    sortHandler?: (list: any[], c: Column) => void,
}, {}, {}, {}, {}, {}, {}, {
    resize: (data: { width: number, height: number, pageSize: number }) => void
    scroll: (data: { y: number, height: number, percent: number }) => void
    load: (data: any[]) => void
    sort: (c: Column) => void
    setting: (c: Column) => void
    selected: (item: any) => void
    execute: (item: any) => void
    contextmenu: (data: { evt: MouseEvent, item: any, index: number }) => void
    drag: (data: { source: number, target: number }) => void
}>

export const Dialog: DefineComponent<{
    width: number,
    height: number,
    top?: number,
    right?: number,
    bottom?: number,
    left?: number,
    title?: string,
    modal?: boolean,
    visible: boolean,
    loading?: boolean,
    keyboardIgnore?: boolean,
    shouldClose?: () => boolean,
}, {}, {}, {}, {}, {}, {}, {
    'update:visible': (value: boolean) => void
    close: () => void
}>

export const htmlEditor: DefineComponent<{
    value: string,
    placeholder?: string,
    upload?: (file: File) => Promise<string>,
}>

export const Input: DefineComponent<{
    value?: string,
    placeholder?: string,
    round?: boolean,
    textarea?: boolean,
    password?: boolean,
    maxlength?: number,
    maxTip?: boolean,
    disabled?: boolean,
    readonly?: boolean,
}, {}, {}, {}, {}, {}, {}, {
    focus: () => void
    blur: () => void
    keydown: (evt: KeyboardEvent) => void
    'update:value': (value: string) => void
    change: () => void
}>

export const Link: DefineComponent<{
    color?: string,
    more?: boolean,
    actived?: boolean,
    disabled?: boolean,
}, {}, {}, {}, {}, {}, {}, {
    click: (e: MouseEvent) => void;
}>

export const Loading: DefineComponent<{
    tip?: string,
    visible?: boolean,
    fixed?: boolean,
}>

export const Pagination: DefineComponent<{
    total: number;
    size: number;
    page?: number;
}, {}, {}, {}, {}, {}, {}, {
    'update:page': (value: number) => void
    change: () => void
}>

export const Radio: DefineComponent<{
    value?: any,
    selected?: any,
    disabled?: boolean,
    readonly?: boolean,
}, {}, {}, {}, {}, {}, {}, {
    'update:selected': (value: any) => void
    change: () => void
}>

export const Scroller: DefineComponent<{
    scrollX?: boolean,
    border?: boolean,
}, {}, {}, {}, {}, {}, {}, {
    scroll: (data: ScrollEvent) => void
}>

export const SwitchBar: DefineComponent<{
    options: Option<any>[],
    value?: any,
}, {}, {}, {}, {}, {}, {}, {
    'update:value': (value: any) => void
    change: () => void
}>

export const Switcher: DefineComponent<{
    value: boolean,
    readonly?: boolean,
    disabled?: boolean,
}, {}, {}, {}, {}, {}, {}, {
    'update:value': (value: boolean) => void
    change: () => void
}>

export const TabPages: DefineComponent<{
    options: Option<any>[],
    value: any,
    border?: boolean,
    full?: boolean,
    readonly?: boolean,
}, {}, {}, {}, {}, {}, {}, {
    'update:value': (value: any) => void
    change: () => void
}>

export const Tree: DefineComponent<{
    options: MenuOption<any>[],
    value: string[],
}, {}, {}, {}, {}, {}, {}, {
    'update:value': (value: any) => void
    change: () => void
    contextmenu: (e: MouseEvent) => void
}>

export const Uploader: DefineComponent<{
    type: 'image' | 'audio' | 'video' | '',
    accept?: string,
    value: UploadFileItem[],
    limit?: number,
    upload: (file: File) => Promise<string>,
}, {}, {}, {}, {}, {}, {}, {
    change: () => void
}>

export const IconCalendar: DefineComponent<{
    direction?: 'up' | 'down' | 'left'
}>

export const IconClose: DefineComponent<{
    direction?: 'up' | 'down' | 'left'
}>

export const IconEye: DefineComponent<{
    direction?: 'up' | 'down' | 'left'
}>

export const IconEyeClose: DefineComponent<{
    direction?: 'up' | 'down' | 'left'
}>

export const IconLoading: DefineComponent<{
    direction?: 'up' | 'down' | 'left'
}>

export const IconNext: DefineComponent<{
    direction?: 'up' | 'down' | 'left'
}>

export const IconNext2: DefineComponent<{
    direction?: 'up' | 'down' | 'left'
}>

export const IconRight: DefineComponent<{
    direction?: 'up' | 'down' | 'left'
}>

export const IconSearch: DefineComponent<{
    direction?: 'up' | 'down' | 'left'
}>

export const IconSetting: DefineComponent<{
    direction?: 'up' | 'down' | 'left'
}>
