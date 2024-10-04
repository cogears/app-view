import { Router } from 'vue-router'

export interface TaskFunction {
    (...args: Array<any>): Promise<any>
}
export interface TaskHandle {
    run(...args: Array<any>): void
    cancel(): void
}

export interface PromiseTask<T> {
    cancel(): void
    then(deployTask: (data: T) => void): PromiseTask<T>
    catch(errorHandler: Function): PromiseTask<T>
    finally(finallyHandler: Function): PromiseTask<T>
}

// 包装延迟任务
export function delayTask(task: Function, delayTime: number): TaskHandle
// 包装周期任务
export function periodTask(task: Function, periodTime: number): TaskHandle
// 包装收束任务
export function packTask(task: Function, delay: number = 0): TaskFunction
// 包装异步数据加载任务
export function executeLoadTask<T>(loadTask: () => Promise<T>): PromiseTask<T>

// 提取数据
export function fetchValue(data: any, key: string): any
// 设置数据
export function setupValue(data: any, key: string, value: any): void
// 复制数据
export function copyValue(source: any): any

export const formatter: {
    n2(value: number): string
    date(timestamp: number, format: string = '{YYYY}-{MM}-{DD}'): string
    time(timestamp: number, format: string = '{hh}:{mm}:{ss}'): string
    datetime(timestamp: number, format: string = '{YYYY}-{MM}-{DD} {hh}:{mm}:{ss}'): string
    week(timestamp: number): string
    cold(seconds: number): string
    number(value: number, fractionDigits: number = 2, symbol: boolean = false): string
    percent(value: number, fractionDigits: number = 2, symbol: boolean = false): string
    amount(value: number, fractionDigits: number = 2, symbol: boolean = false): string
    unit(value: number, fractionDigits: number = 2, symbol: boolean = false): string
    fileSize(value: number): string
    mask(value: string): string
    text(template: string, env: any, nullReplace?: string): string
};

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