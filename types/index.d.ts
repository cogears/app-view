import { Router } from "vue-router";
export * from './common';
export * from './components';
export * from './renders';

export interface EventListener {
    (event: string, ...args: Array<any>): void;
}

export class EventDispatcher {
    hasEventListeners(event: string): boolean
    addEventListener(event: string, listener: EventListener): void
    removeEventListener(event: string, listener?: EventListener): void
    removeAllEventLsiteners(): void
    dispatch(event: string, ...args: any[]): boolean
}

export interface KeyboardEventListener {
    (e: KeyboardEvent): void
}

export interface KeyboardManager {
    addEventListener(listener: KeyboardEventListener): void
    removeEventListener(listener: KeyboardEventListener): void
    pushMonopolyKeyboard(): void
    popMonopolyKeyboard(): void
}

export interface DeviceManager {
    loading(visible: boolean, message: string): void
    toast(message: string): void
    alert(message: string, title?: string, ok?: string): Promise<void>
    confirm(message: string, title?: string, ok?: string, cancel?: string, tip?: string): Promise<boolean>
    prompt(message: string, title?: string, value?: string): Promise<string>
    contextMenu<T>(options: MenuOption<T>[], options2: { x: number, y: number, width?: number, height?: number, align?: 'left' | 'right', multiple?: boolean }): Promise<T[] | void>
    calendar(date: Date | undefined, options2: { x: number, y: number, width?: number, multiple?: boolean }, marks?: Date[]): Promise<Date | void>
}

export class ViewContext {
    static readonly NAME: Symbol
    get query(): any
    get router(): Router
    get device(): DeviceManager
    get keyboard(): KeyboardManager
    parseQuery(search: string): Record<string, string>
    startup<T extends Transaction<any>>(transactionClass: Class<T>): T
    complete(transaction: Transaction<any>): void
}

export class Transaction<T extends ViewContext> extends EventDispatcher {
    get context(): T
    toString(): string
    start(): boolean
    next(data?: any): void
    shouldAbort(): Promise<boolean>
    abort(): void
}

export interface RenderOptions {
    routes: RouteRecordRaw[],
    theme?: string
}

export function render(options: RenderOptions): ViewContext