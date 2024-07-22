import { AppOptions, PageOptions, ViewContext } from "types";
import { RouteRecordRaw, Router } from "vue-router";
import AppContext from './AppContext';
import RenderPage from './RenderPage.vue';

export function createApp(app: AppOptions) {
    const routes = app.pages.map(createRoute)
    if (routes.every(item => item.path != '/')) {
        routes.push({
            path: '/',
            redirect: routes[0].path
        })
    }
    return {
        routes,
        contextBuilder(router: Router) {
            return new AppContext(router, app) as ViewContext
        }
    }
}

function createRoute(page: PageOptions<any>): RouteRecordRaw {
    return {
        name: page.name,
        path: page.path,
        component: RenderPage,
        meta: {
            options: page
        }
    }
}