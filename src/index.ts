import { createApp } from "vue";
import { RouteRecordRaw, createRouter, createWebHashHistory } from "vue-router";
import Root from './Root.vue'
import './styles/base.scss'
import ViewContext from "./ViewContext";

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