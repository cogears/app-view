import { RenderOptions } from 'types';
import { Component, ComponentPublicInstance, createApp, h } from "vue";
import { createRouter, createWebHashHistory } from 'vue-router';
import ViewContext from "./ViewContext";
import Devices from './devices/Root.vue';
import directives from "./directives";
import './styles/base.scss';

export function render(options: RenderOptions): ViewContext {
    const router = newRouter(options)
    const context = options.contextBuilder ? options.contextBuilder(router) : new ViewContext(router)
    const app = createApp(newRootView(options.view))
    app.use(router)
    app.use(directives)
    app.provide(ViewContext.NAME, context)
    app.config.errorHandler = errorCatcher
    app.mount('#app')
    document.documentElement.className = options.theme || 'light'
    if (options.mouseRightEnabled) {
        fixDocument()
    }
    return context
}

function newRootView(view: Component) {
    return () => [h(view), h(Devices)]
}

function newRouter(options: RenderOptions) {
    return createRouter({
        routes: options.routes,
        history: createWebHashHistory()
    })
}

function errorCatcher(err: unknown, _instance: ComponentPublicInstance | null, _info: string) {
    console.error(err)
}


function fixDocument() {
    document.addEventListener('contextmenu', ignore, false);
}

function ignore(e: any) {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
}