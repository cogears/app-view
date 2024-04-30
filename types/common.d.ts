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


export interface Formatter {
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
}