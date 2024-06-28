import { ViewContext } from "types"

export interface AppContext extends ViewContext {
    appState: AppState,
    appNavigators: AppNavigator[],
    appLogin: ActionTransacation<UserState>,
    isOnline(): boolean,
    setOnline(user?: UserState): void
}

export interface UserState {
    id: string | number,
    name: string,
    token: string,
}

export interface AppState {
    name: string,
    logo: string,
    background: string,
    user: UserState,
}

export interface AppOptions {
    state: AppState,
    pages: PageOptions[],
    navigators: AppNavigator[],
    loginTransaction: ActionTransacation<UserState>,
}

export interface AppNavigator {
    label: string,
    path: string,
    children?: AppNavigator[]
}

export interface Action {
    name: string,
    args: any[]
}

export interface ActionTransacation<T> {
    name: string,
    execute(context: AppContext, data: any, state: any): Promise<T>,
}

export interface PageOptions extends SceneOptions {
    name: string,
    path: string,
}

export interface SceneOptions {
    state: any,
    view: ContainerOptions,
}

export interface ContainerOptions {
    children: NodeOptions[],
    direction?: 'row' | 'column',
}

export interface NodeOptions {
    type: 'scene' | 'container' | 'text' | 'image' | 'button' | 'select' | 'input',
    style: StyleOptions,
    scene?: SceneOptions,
    container?: ContainerOptions,
    text?: TextOptions,
    image?: ImageOptions,
    button?: ButtonOptions,
    select?: SelectOptions,
    input?: InputOptions,
}

export interface TextOptions {

}

export interface ImageOptions {

}

export interface ButtonOptions {

}

export interface SelectOptions {

}

export interface InputOptions {

}

export interface StyleOptions {
    width?: number,
    height?: number,
    full?: boolean,
}
