import { RenderOptions } from 'types';
import { createApp, h } from "vue";
import { RouterView, createRouter, createWebHashHistory } from "vue-router";
import ViewContext from "./ViewContext";
import Devices from './devices/Root.vue';
import { install as installDirectives } from "./directives";
import './styles/base.scss';

export function render(options: RenderOptions) {
    const router = newRouter(options)
    const context = options.contextBuilder ? options.contextBuilder(router) : new ViewContext(router)
    const app = createApp(newRootView())
    app.use(router)
    app.provide(ViewContext.NAME, context)
    installDirectives(app)
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
