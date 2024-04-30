import { PromiseTask, TaskFunction, TaskHandle } from 'types'

class PromiseManager {
    private _waitTask: Array<{ resolve: Function, reject: Function }> = []
    get length() {
        return this._waitTask.length
    }
    push(resolve: Function, reject: Function) {
        this._waitTask.push({ resolve, reject })
    }
    resolve(value?: any) {
        for (let handler of this._waitTask) {
            try {
                handler.resolve(value)
            } catch (e) { }
        }
        this._waitTask = []
    }
    reject(reason?: any) {
        for (let handler of this._waitTask) {
            try {
                handler.reject(reason)
            } catch (e) { }
        }
        this._waitTask = []
    }
}

export function delayTask(task: Function, delayTime: number): TaskHandle {
    let timer: any = 0
    function cancel() {
        clearTimeout(timer)
    }
    return {
        run(...args: Array<any>) {
            cancel()
            timer = setTimeout(() => {
                task(...args)
            }, delayTime);
        },
        cancel() {
            cancel()
        }
    }
}

export function periodTask(task: Function, periodTime: number): TaskHandle {
    let timer: any = 0
    function cancel() {
        clearTimeout(timer)
    }
    return {
        run(...args: Array<any>) {
            cancel()
            timer = setInterval(() => {
                task(...args)
            }, periodTime)
        },
        cancel() {
            cancel()
        }
    }
}

export function packTask(task: Function, delay: number = 0): TaskFunction {
    const promises = new PromiseManager()
    return function (...args: any[]) {
        return new Promise((resolve, reject) => {
            promises.push(resolve, reject)
            if (promises.length == 1) {
                setTimeout(async () => {
                    try {
                        let r = await task(...args)
                        promises.resolve(r)
                    } catch (e) {
                        promises.reject(e)
                    }
                }, delay);
            }
        })
    }
}

export function executeLoadTask<T>(loadTask: () => Promise<T>): PromiseTask<T> {
    let _running = true
    let _deployTask: Function
    let _errorHandler: Function
    let _finallyHandler: Function
    async function run() {
        try {
            let data = await loadTask()
            if (_running) {
                _deployTask(data)
            }
        } catch (e) {
            if (_running && _errorHandler) {
                _errorHandler(e)
            }
        } finally {
            if (_running && _finallyHandler) {
                _finallyHandler()
            }
        }
    }
    return {
        cancel() {
            _running = false
        },
        then(deployTask: (data: T) => void) {
            _deployTask = deployTask
            run()
            return this
        },
        catch(errorHandler: Function) {
            _errorHandler = errorHandler
            return this
        },
        finally(finallyHandler: Function) {
            _finallyHandler = finallyHandler
            return this
        }
    }
}
