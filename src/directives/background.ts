import { Directive } from 'vue'

export const background: Directive = function (el, binding) {
    const url = binding.value
    if (url) {
        el.style['background-image'] = `url('${url}')`
        el.style['background-size'] = 'cover'
        el.style['background-position'] = 'center center'
    }
}