import { MenuOption, PageOptions } from 'types'
import domainScene from './domain-form'

interface State {
    search: {
        name: string,
    },
    apiTree: MenuOption<number>[],
    apiTreeValue: string[],
    domain: {
        input?: any
    }
}

let seed: number = 1

const page: PageOptions<State> = {
    name: '接口管理',
    path: '/apis',
    state: {
        search: {
            name: '',
        },
        apiTree: [],
        apiTreeValue: [],
        domain: {
            input: undefined,
        }
    },
    view: {
        style: { full: true },
        type: 'container', container: {
            direction: 'column',
            children: [
                {
                    type: 'container', container: {
                        children: [
                            {
                                type: 'input', input: { name: 'search.name', placeholder: '请输入搜索的名称或域名' },
                                style: { width: 256 }
                            },
                            { style: { full: true } },
                            { type: 'button', button: { label: '添加域环境', onClick: [{ name: 'add-domain', data: [] }] } },
                        ]
                    }
                },
                {
                    type: 'container', container: {
                        children: [
                            {
                                type: 'tree', tree: {
                                    name: 'apiTreeValue', source: 'apiTree', onChanged: [
                                        { name: 'set-domain', data: [] }
                                    ]
                                },
                                style: { width: 256 }
                            },
                            {
                                type: 'container', container: {
                                    children: [
                                        {
                                            type: 'scene', scene: domainScene,
                                            style: { full: true },
                                        }
                                    ]
                                },
                                style: { full: true, border: true }
                            }
                        ]
                    },
                    style: { full: true }
                },
            ]
        }
    },
    controllers: [
        {
            name: 'init', async execute(context, _data, state) {
                let apis = context.appState.project.apis
                state.apiTree = apis.map((item: any) => ({ key: seed++, label: item.name }))
            },
        },
        {
            name: 'add-domain', async execute(_context, _data, state) {
                state.domain.input = { key: seed++, name: '', origin: '', apis: [] }
            },
        },
        {
            name: 'set-domain', async execute(_context, _data, state) {
                console.info(state.apiTreeValue)
            },
        },
        {
            name: 'save-domain', async execute(_context, data, _state) {
                console.info('save-domain', data[0])
            },
        },
    ],
    onInit: [
        { name: 'init', data: [] }
    ]
}

export default page