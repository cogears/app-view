import { EventListener } from 'types'

export default class EventDispatcher {
    private _eventHandlers: Record<string, EventListener[]> = {};

    hasEventListeners(event: string) {
        return this._eventHandlers[event] && this._eventHandlers[event].length > 0
    }

    addEventListener(event: string, listener: EventListener) {
        if (this._eventHandlers[event]) {
            let i = this._eventHandlers[event].indexOf(listener);
            if (i == -1) {
                this._eventHandlers[event].push(listener);
            }
        } else {
            this._eventHandlers[event] = [listener];
        }
    }

    removeEventListener(event: string, listener?: EventListener) {
        if (this._eventHandlers[event]) {
            if (listener) {
                let i = this._eventHandlers[event].indexOf(listener);
                if (i >= 0) {
                    this._eventHandlers[event].splice(i, 1);
                    if (this._eventHandlers[event].length == 0) {
                        delete this._eventHandlers[event];
                    }
                }
            } else {
                delete this._eventHandlers[event];
            }
        }
    }

    removeAllEventLsiteners() {
        this._eventHandlers = {};
    }

    dispatch(event: string, ...args: any[]) {
        if (this.hasEventListeners(event)) {
            const listeners = this._eventHandlers[event].slice();
            setTimeout(() => {
                for (let listener of listeners) {
                    try {
                        listener(event, ...args);
                    } catch (e) {
                        console.error(e);
                    }
                }
            }, 0);
            return true
        }
        return false
    }
}