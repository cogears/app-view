import { KeyboardEventListener, KeyboardManager } from 'types';

export class KeyboardUtil implements KeyboardManager {
    private readonly _keyboardListeners: KeyboardEventListener[] = []
    private _monopolyKeyboardListeners: number = 0
    constructor() {
        document.onkeydown = this.onKeydown.bind(this)
    }

    addEventListener(listener: KeyboardEventListener) {
        if (this._keyboardListeners.indexOf(listener) == -1) {
            this._keyboardListeners.push(listener);
        }
    }

    removeEventListener(listener: KeyboardEventListener) {
        let i = this._keyboardListeners.indexOf(listener);
        if (i >= 0) {
            this._keyboardListeners.splice(i, 1);
        }
    }

    pushMonopolyKeyboard() {
        this._monopolyKeyboardListeners++
        return this._monopolyKeyboardListeners
    }

    popMonopolyKeyboard() {
        this._monopolyKeyboardListeners--
        return this._monopolyKeyboardListeners
    }

    private onKeydown(e: KeyboardEvent) {
        if (this._monopolyKeyboardListeners > 0) {
        } else {
            this._keyboardListeners.forEach(listener => {
                listener(e)
            })
        }
    }
}

export default new KeyboardUtil()