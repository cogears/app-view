import { Router } from "vue-router";
import EventDispatcher from "./common/EventDispatcher";
import keyboard, { KeyboardUtil } from "./common/keyboard";
import DeviceManager from "./devices";
import { InjectionKey } from 'vue'

export default class ViewContext extends EventDispatcher {
    static readonly NAME: InjectionKey<ViewContext> = Symbol('ViewContext')
    readonly router: Router
    readonly query: Record<string, string>
    readonly device = new DeviceManager(this)

    private readonly _transactions: Array<Transaction<ViewContext>> = []

    constructor(router: Router) {
        super()
        this.query = this.parseQuery(window.location.search)
        this.router = router
    }

    get keyboard(): KeyboardUtil {
        return keyboard
    }

    parseQuery(search: string): Record<string, string> {
        let query: any = {}
        let pairs = search.substring(1).split('&').map(s => s.split('='))
        for (let ks of pairs) {
            if (ks[0]) {
                query[ks[0]] = ks[1]
            }
        }
        return query
    }

    async startup<T extends Transaction<any>>(transactionClass: Class<T>): Promise<T> {
        let transaction = new transactionClass(this)
        let key = transaction.toString()
        let old = this._transactions.find(item => item.toString() == key)
        if (old) {
            if (await old.shouldAbort()) {
                old.abort()
            } else {
                throw new Error('有相同事务未完成:' + key)
            }
        }
        this._transactions.push(transaction)
        console.debug('start', transaction.toString())
        if (!transaction.start()) {
            setTimeout(() => {
                transaction.abort()
            }, 0);
        }
        return transaction
    }

    complete(transaction: Transaction<any>) {
        transaction.removeAllEventLsiteners()
        let i = this._transactions.indexOf(transaction)
        if (i >= 0) {
            this._transactions.splice(i, 1)
        }
    }
}

export class Transaction<T extends ViewContext> extends EventDispatcher {
    static readonly COMMIT = 'commit'
    static readonly ABORT = 'abort'
    readonly context: T
    constructor(context: T) {
        super()
        this.context = context
    }

    toString() {
        return this.constructor.name
    }

    start(): boolean {
        return false
    }

    next(data?: any) {
        this.commit(data)
    }

    async shouldAbort(): Promise<boolean> {
        return true
    }

    abort() {
        console.debug('abort', this.toString())
        this.dispatch(Transaction.ABORT)
        this.context.complete(this)
    }

    private commit(data: any) {
        console.debug('commit', this.toString(), data)
        this.dispatch(Transaction.COMMIT, data)
        this.context.complete(this)
    }
}

export function generatetCommandTransaction(event: string, ...args: any[]) {
    return class CommandTransaction extends Transaction<ViewContext> {
        start() {
            return this.context.dispatch(event, this, ...args)
        }
        toString(): string {
            return super.toString() + ': ' + event
        }
    }
}