import { Directive } from 'vue'

export const focus: Directive = function (el: HTMLInputElement) {
    el.focus()
}