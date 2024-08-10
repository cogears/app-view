import ViewContext, { Transaction } from "../ViewContext"
import EventDispatcher from "../common/EventDispatcher"
import { MenuOption, DeviceManager as IDeviceManager } from "types"

export const TOAST = 'toast'
export const TOOLTIP = 'tooltip'
export const ALERT = 'alert'
export const CONFIRM = 'confirm'
export const PROMPT = 'prompt'
export const CONTEXT_MENU = 'context-menu'
export const CALENDAR = 'calendar'
export const LOADING = 'loading'

export default class DeviceManager extends EventDispatcher implements IDeviceManager {
    private readonly _context: ViewContext
    constructor(context: ViewContext) {
        super()
        this._context = context
    }

    loading(visible: boolean, message: string) {
        this.dispatch(LOADING, visible, message)
    }

    toast(message: string) {
        this.dispatch(TOAST, message)
    }

    alert(message: string, title?: string, ok?: string): Promise<void> {
        return new Promise(async resolve => {
            class AlertTransaction extends Transaction<ViewContext> {
                start() {
                    return this.context.device.dispatch(ALERT, this, message, title, ok)
                }
            }
            let transaction = await this._context.startup(AlertTransaction)
            transaction.addEventListener(Transaction.COMMIT, () => resolve())
            transaction.addEventListener(Transaction.ABORT, () => resolve())
        })
    }

    confirm(message: string, title?: string, ok?: string, cancel?: string, tip?: string): Promise<boolean> {
        return new Promise(async resolve => {
            class ConfirmTransaction extends Transaction<ViewContext> {
                start() {
                    return this.context.device.dispatch(CONFIRM, this, message, title, ok, cancel, tip)
                }
            }
            let transaction = await this._context.startup(ConfirmTransaction)
            transaction.addEventListener(Transaction.COMMIT, () => resolve(true))
            transaction.addEventListener(Transaction.ABORT, () => resolve(false))
        })
    }

    prompt(message: string, title?: string, value?: string): Promise<string> {
        return new Promise(async resolve => {
            class PromptTransaction extends Transaction<ViewContext> {
                start() {
                    return this.context.device.dispatch(PROMPT, this, message, title, value)
                }
            }
            let transaction = await this._context.startup(PromptTransaction)
            transaction.addEventListener(Transaction.COMMIT, (_, value: string) => resolve(value))
            transaction.addEventListener(Transaction.ABORT, () => resolve(''))
        })
    }

    contextMenu<T>(options: MenuOption<T>[], options2: { x: number, y: number, width?: number, height?: number, align?: 'left' | 'right', multiple?: boolean }): Promise<T[] | void> {
        return new Promise(async resolve => {
            class ContextMenuTransaction extends Transaction<ViewContext> {
                get isTick(): boolean {
                    return true
                }
                start() {
                    return this.context.device.dispatch(CONTEXT_MENU, this, options, options2)
                }
            }
            let transaction = await this._context.startup(ContextMenuTransaction)
            transaction.addEventListener(Transaction.COMMIT, (_, result: any) => resolve(result))
            transaction.addEventListener(Transaction.ABORT, () => resolve())
        })
    }

    calendar(date: Date | undefined, options2: { x: number, y: number, width?: number, multiple?: boolean }): Promise<Date | void> {
        return new Promise(async resolve => {
            class CalendarTransaction extends Transaction<ViewContext> {
                start() {
                    return this.context.device.dispatch(CALENDAR, this, date, options2)
                }
            }
            let transaction = await this._context.startup(CalendarTransaction)
            transaction.addEventListener(Transaction.COMMIT, (_, result: any) => resolve(result))
            transaction.addEventListener(Transaction.ABORT, () => resolve())
        })
    }
}