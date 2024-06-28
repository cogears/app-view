import { AppOptions, PageOptions, ViewContext } from "types";
import { RouteRecordRaw, Router } from "vue-router";
import { render } from '../starter';
import AppContext from './AppContext';
import RenderPage from './RenderPage.vue';

export function startup(app: AppOptions) {
    const routes = app.pages.map(createRoute)
    render({
        routes,
        contextBuilder(router: Router) {
            return new AppContext(router, app) as ViewContext
        }
    })
}

function createRoute(page: PageOptions): RouteRecordRaw {
    return {
        name: page.name,
        path: page.path,
        component: RenderPage,
        meta: {
            options: page
        }
    }
}