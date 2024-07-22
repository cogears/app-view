import { App } from "vue";
import { background } from "./background";
import { focus } from './focus';

export default function (app: App) {
    app.directive('bg', background)
    app.directive('focus', focus)
}
