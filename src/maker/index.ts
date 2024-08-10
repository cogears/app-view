import { createApp, render } from '@/index'
import { AppOptions, ApiDomain } from 'types'
import pages from './pages'

const apis: ApiDomain[] = [
    {
        name: '测试',
        origin: 'https://localhost',
        apis: []
    }
]

const project = {
    apis,
}

const app: AppOptions = {
    state: {
        name: 'AppMaker',
        logo: '',
        background: '',
        user: { id: 11, name: 'STone', token: '' },
        project,
    },
    apis: [],
    pages,
    navigators: [
        { key: '/home', label: '首页' },
        { key: '/pages', label: '页面' },
        { key: '/navigators', label: '导航' },
        { key: '/apis', label: '接口' },
    ],
}

render(Object.assign(createApp(app), { mouseRightEnabled: true }))