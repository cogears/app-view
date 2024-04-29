export interface IInput {
    focus(): void
    blur(): void
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