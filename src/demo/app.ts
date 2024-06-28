import { AppOptions, AppContext, UserState } from "types";
import pages from './pages'

export const app: AppOptions = {
    state: {
        name: 'App View',
        logo: 'logo.png',
        background: 'login-background.svg',
        user: {
            id: 0,
            name: '',
            token: '',
        }
    },
    pages,
    loginTransaction: {
        name: '', async execute(_context: AppContext, data: { username: string, password: string }): Promise<UserState> {
            return { id: 1, name: data.username, token: 'token' }
        },
    },
    navigators: [
        { label: '圈子管理', path: '/admin-circles' },
        {
            label: '直播管理', path: '/admin-courses', children: [
                { label: '课包管理', path: '/admin-courses' },
                { label: '课程管理', path: '/admin-lessons' },
            ]
        },
        { label: 'IP老师管理', path: '/admin-ips' },
    ]
}