import { HttpOptions } from "@cogears/http-client";
import { Component, InjectionKey } from "vue";
import { ViewContext } from "./common";
import { Color, Column, MenuOption, Option, UploadFileItem } from "./components";

export type AppContextType = InjectionKey<AppContext>;
export interface AppContext extends ViewContext {
    appState: AppState,
    appNavigators: AppNavigator[],
    appLogin?: ActionTransacation<any, UserState>,
    appUpload?: ActionTransacation<any, string>,
    isOnline(): boolean,
    setOnline(user?: UserState): void,
    submitRequest<T>(key: string, options?: HttpOptions): Promise<T>,
}

export interface UserState {
    id: string | number,
    name: string,
    token: string,
    [index: string]: any
}

export interface AppState {
    name: string,
    logo: string,
    background: string,
    user: UserState,
    [index: string]: any
}

export interface AppOptions {
    apis: ApiDomain[],
    state: AppState,
    pages: PageOptions[],
    navigators: MenuOption<string>[],
    loginTransaction?: ActionTransacation<any, UserState>,
    uploadTransaction?: ActionTransacation<any, string>,
}

export interface Action {
    name: string,
    data: any[],
}

export interface ActionEvent {
    action: Action,
    resolve?: Function,
    reject?: Function,
}

export interface ActionTransacation<S, R> {
    name: string,
    execute(context: AppContext, data: any, state: S): Promise<R>,
}

export interface ApiDomain {
    name: string,
    origin: string,
    apis: Api[],
    headers?: Record<string, string>,
    query?: Record<string, any>,
    validate?: {
        key: string,
        value: string,
        error: string,
    },
    result?: string
}

export interface Api {
    name: string,
    method: 'get' | 'post' | 'put' | 'patch' | 'delete',
    url: string,
    headers?: Record<string, string>,
    query?: Record<string, any>
    map?: ApiDataMap | ApiDataMap[],
    body?: any,
}

export interface ApiDataMap {
    key: string,
    rename?: string,
    type?: 'object' | 'array' | 'string'
    map?: ApiDataMap | ApiDataMap[]
}

export interface DataCompare {
    source: string,
    target: string,
    mapRule?: DataCompareRule,
    reductRule?: 'and' | 'or'
}

type DataCompareRule = '=' | '<' | '<=' | '>' | '>=' | 'like'

export interface SceneOptions<S> {
    input?: string,
    output?: string,
    state: S,
    view: NodeOptions,
    controllers: ActionTransacation<S, any>[],
    onInit?: Action[],
    onStart?: Action[],
    onDispose?: Action[],
}

export interface PageOptions<S> extends SceneOptions<S> {
    name: string,
    path: string,
}

export interface DialogState {
    visible: boolean,
    [index: string]: any,
}
export interface DialogOptions<S> extends SceneOptions<S> {
    name: string,
    title: string,
    width: number,
    height: number,
}

export interface TabPagesOptions {
    name: string,
    pages: Array<{ name: string } & SceneOptions>,
}

interface ContainerOptions {
    children: NodeOptions[],
    direction?: 'row' | 'column',
    align?: 'left' | 'center' | 'right',
}

export interface NodeOptions {
    type?: 'scene' | 'container' | 'text' | 'image' | 'button' | 'input' | 'html-editor' | 'checkbox' | 'radio' | 'select' | 'tree' | 'switcher' | 'date' | 'date-range' | 'uploader' | 'table' | 'pagination' | 'dialog' | 'tab-pages' | 'form' | 'form-field' | 'list' | 'iframe' | 'custom',
    label?: string,
    visible?: string,
    style?: StyleOptions,
    scene?: SceneOptions,
    container?: ContainerOptions,
    text?: TextOptions,
    image?: ImageOptions,
    button?: ButtonOptions,
    input?: InputOptions,
    htmlEditor?: HtmlEditorOptions,
    checkbox?: CheckboxOptions,
    radio?: RadioOptions,
    select?: SelectOptions,
    tree?: TreeOptions,
    switcher?: SwitcherOptions,
    date?: DateOptions,
    dateRange?: DateRangeOptions,
    uploader?: UploaderOptions,
    table?: TableOptions,
    pagination?: PaginationOptions,
    dialog?: DialogOptions,
    tabPages?: TabPagesOptions,
    form?: FormOptions,
    formField?: FormFieldOptions,
    list?: ListOptions,
    iframe?: IFrameOptions,
    custom?: CustomViewOptions,
}

export interface TextOptions {
    label: string,
    color?: Color,
    size?: 'big' | 'small',
    onClick?: Action[]
}

export interface ImageOptions {
    name: string,
    width: number,
    height: number,
    round?: boolean,
    onClick?: Action[],
}

export interface ButtonOptions {
    label: string,
    color?: Color,
    theme?: 'normal' | 'line',
    round?: boolean,
    on?: boolean,
    readonly?: boolean,
    disabled?: boolean,
    onClick: Action[]
}

export interface InputOptions {
    name: string,
    type?: 'text' | 'number' | 'search',
    textarea?: boolean,
    placeholder?: string,
    maxlength?: number,
    disabled?: string,
    onChanged?: Action[],
    onEnter?: Action[],
}

export interface HtmlEditorOptions {
    name: string,
    placeholder?: string,
}

export interface SwitcherOptions {
    name: string,
    disabled?: string,
    map?: Record<string, boolean>,
    onChanged?: Action[],
}

export interface DateOptions {
    name: string,
    disabled?: string,
    onChanged?: Action[],
}

export interface DateRangeState {
    from: Date,
    to: Date,
}
export interface DateRangeOptions {
    name: string,
    disabled?: string,
    onChanged?: Action[],
}

export interface CheckboxOptions {
    name: string,
    source: string | Option<any>[],
    showAll?: boolean
    disabled?: string,
    onChanged?: Action[],
}

export interface RadioOptions {
    name: string,
    source: string | Option<any>[],
    disabled?: string,
    onChanged?: Action[],
}

export interface SelectOptions {
    name: string,
    source: string | Option<any>[],
    placeholder?: string,
    disabled?: string,
    onChanged?: Action[],
}

export interface TreeOptions {
    name: string,
    source: string | MenuOption<any>[],
    onChanged?: Action[],
    onContextMenu?: Action[],
}

export type UploaderState = UploadFileItem[]

export interface UploaderOptions {
    name: string,
    type: 'image' | 'video' | 'audio' | '',
    label?: string,
    limit?: number,
    accept?: string,
    onChanged?: Action[],
}

export interface TableState {
    source: any[],
    total: number,
    loading: boolean,
    selected: any[],
    sort: Column | undefined,
}

export interface TableOptions {
    name: string,
    fields: TableFieldOptions[],
    query?: Record<string, string>,
    filters?: DataCompare[],
    select?: boolean,
    selectLimit?: number,
    serial?: boolean,
    onSelected?: Action[],
    onSort?: Action[],
}

interface TableFieldOptions {
    key: string,
    label: string,
    width?: number,
    format?: string,
    render?: (value: any, c: Column, item: any) => any,
    classNames?: string | ((value: any, c: Column, item: any) => string[]),
    fixed?: boolean,
    suffix?: boolean,
    sort?: 'asc' | 'desc' | 'none',
    orderBy?: string,
    align?: 'left' | 'center' | 'right',
    contents?: NodeOptions[],
}

export interface PaginationState {
    page: number,
    size: number,
    total: number,
}
export interface PaginationOptions {
    name: string,
    onChanged: Action[]
}

export interface FormOptions extends ContainerOptions {
    onSubmit: Action[],
}

export interface FormFieldOptions {
    label: string,
    name?: string,
    require?: boolean,
    content: NodeOptions,
    align?: 'left' | 'right'
    validate?: 'phone' | 'email' | 'password' | RegExp | ((value: string, env: any) => boolean)
}

export interface ListOptions {
    name: string,
    content: NodeOptions
}

export interface IFrameOptions {
    name: string,
}

export interface CustomViewOptions {
    view: Component,
    input: string,
}

export interface StyleOptions {
    width?: number,
    height?: number,
    padding?: number,
    full?: boolean,
    border?: boolean,
}

export var AppActions = {
    ACTION_VALIDATE_INPUT: string,
    ACTION_DELETE_TABLE_ROW: string,
    ACTION_CLOSE_DIALOG: string,
    ACTION_SUBMIT_FORM: string,
    ACTION_REGISTER_FORM_FIELD: string,
}