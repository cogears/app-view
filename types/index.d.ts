import { Component } from 'vue';
import { Router } from "vue-router";
export * from './common';
export * from './components';
export * from './layouts';
export * from './renders';

export interface RenderOptions {
    view: Component,
    routes: RouteRecordRaw[],
    theme?: string,
    mouseRightEnabled?: boolean,
    contextBuilder?: (router: Router) => ViewContext,
}

export function render(options: RenderOptions): ViewContext
export function createApp(app: AppOptions): RenderOptions