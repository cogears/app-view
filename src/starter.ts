import { createApp } from "vue";
import { RouteRecordRaw, createRouter, createWebHashHistory } from "vue-router";
import Root from './Root.vue';
import ViewContext from "./ViewContext";
import './styles/base.scss';

interface RenderOptions {
    routes: RouteRecordRaw[],
    theme?: string
}

export function render(options: RenderOptions) {
    const router = newRouter(options)
    const context = new ViewContext(router)
    const app = createApp(Root)
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

function newRouter(options: RenderOptions) {
    return createRouter({
        routes: options.routes,
        history: createWebHashHistory()
    })
}
