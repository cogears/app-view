import { DefineComponent } from 'vue';
import { MenuOption } from './components';

export const Login1: DefineComponent<{
    appName: string,
    background?: string,
    upload: (username: string, password: string) => Promise<void>,
}>

export const Works1: DefineComponent<{
    appName: string;
    appLogo?: string;
    userName?: string,
    navigators: MenuOption<string>[]
}, {}, {}, {}, {}, {}, {}, {
    quit: () => void;
}>
