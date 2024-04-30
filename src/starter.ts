import { createApp, h } from "vue";
import { RouterView, createRouter, createWebHashHistory } from "vue-router";
import ViewContext from "./ViewContext";
import Devices from './devices/Root.vue';
import './styles/base.scss';
import { RenderOptions } from 'types';

export function render(options: RenderOptions) {
    const router = newRouter(options)
    const context = new ViewContext(router)
    const app = createApp(newRootView())
    app.use(router)
    app.provide(ViewContext.NAME, context)
    app.directive('bg', (el, binding) => {
        if (binding.value) {
            let url = binding.value
            el.style['background-image'] = `url('${url}')`
            el.style['background-size'] = 'cover'
            el.style['background-position'] = 'center center'
        }
    })
    app.mount('#app')
    document.documentElement.className = options.theme || 'light'
    return context
}
function newRootView() {
    return () => [h(RouterView), h(Devices)]
}
function newRouter(options: RenderOptions) {
    return createRouter({
        routes: options.routes,
        history: createWebHashHistory()
    })
}
