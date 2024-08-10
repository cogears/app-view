import { PageOptions, Option, MenuOption } from 'types'
import View from './View.vue'
import base from './base'
import layout from './layout'
import data from './data'

interface State {
    input: any,
    pages: {
        source: Option<string>[],
        value: string,
    },
    pageTree: {
        source: MenuOption<string>[],
        value: string[],
    },
    editor: {
        tab: string,
    }
}

const page: PageOptions<State> = {
    name: '页面管理',
    path: '/pages',
    state: {
        input: {},
        pages: {
            source: [
                { key: '1111', label: '首页' }
            ],
            value: '',
        },
        pageTree: {
            source: [
                {
                    key: 'root', label: '根节点', children: [
                        {
                            key: 'toolbar', label: '工具栏', children: [
                                { key: 'input', label: '搜索框' },
                                { key: 'button', label: '添加按钮' },
                            ]
                        },
                        { key: 'table', label: '表格' },
                        { key: 'paginate', label: '翻页组件' },
                    ]
                }
            ],
            value: [],
        },
        editor: {
            tab: '',
        }
    },
    view: {
        type: 'container', style: { full: true }, container: {
            direction: 'column',
            children: [
                {
                    type: 'container', container: {
                        children: [
                            { type: 'select', style: { width: 280 }, select: { name: 'pages.value', source: 'pages.source' } },
                            { style: { full: true } },
                            { type: 'button', button: { label: '新建页面', onClick: [] } },
                        ]
                    }
                },
                {
                    type: 'container', style: { full: true }, container: {
                        children: [
                            {
                                type: 'tree', style: { width: 280 }, tree: {
                                    name: 'pageTree.value', source: 'pageTree.source',
                                    onContextMenu: [
                                        { name: 'context-menu-tree', data: [] }
                                    ]
                                }
                            },
                            {
                                type: 'container', style: { full: true, border: true }, container: {
                                    children: [
                                        { type: 'custom', custom: { view: View, input: '' } }
                                    ]
                                }
                            },
                            {
                                type: 'tab-pages', style: { width: 400 }, tabPages: {
                                    name: 'editor.tab',
                                    pages: [
                                        Object.assign(base, { name: '页面信息' }),
                                        Object.assign(layout, { name: '节点布局' }),
                                        Object.assign(data, { name: '数据绑定' }),
                                    ]
                                }
                            }
                        ]
                    }
                }
            ]
        }
    },
    controllers: [
        {
            name: 'context-menu-tree', async execute(context, data, state) {
                let event: MouseEvent = data[0]
                let op2 = { x: event.clientX, y: event.clientY, width: 200 }
                if (state.pageTree.value.length > 0) {
                    let r = await context.device.contextMenu([
                        { key: 'insert', label: '插入节点' },
                        { key: 'remove', label: '删除节点' },
                    ], op2)
                    console.info('---', r)
                } else {
                    let r = await context.device.contextMenu([{ key: 'insert', label: '插入节点' }], op2)
                    console.info('---', r)
                }
            },
        }
    ]
}

export default page