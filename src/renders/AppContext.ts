import { copyValue } from '@/common/dataUtil';
import { AppOptions, AppState, UserState } from 'types';
import { ref } from 'vue';
import { Router } from 'vue-router';
import ViewContext from '../ViewContext';

const ONLINE_SESSION = '__session__'

export default class AppContext extends ViewContext {
    private readonly _app: AppOptions;
    private readonly _appState = ref<AppState>({
        name: '', logo: '', background: '',
        user: { id: 0, name: '', token: '' },
    })

    constructor(router: Router, app: AppOptions) {
        super(router)
        this._app = app
        this._appState.value = copyValue(app.state)
    }

    get appState() {
        return this._appState.value
    }

    get appNavigators() {
        return this._app.navigators
    }

    get appLogin() {
        return this._app.loginTransaction
    }

    isOnline() {
        let text = sessionStorage.getItem(ONLINE_SESSION)
        if (text) {
            this.appState.user = JSON.parse(text)
            return true
        }
        return false
    }

    setOnline(user?: UserState) {
        if (user) {
            this.appState.user = user
            sessionStorage.setItem(ONLINE_SESSION, JSON.stringify(user))
        } else {
            this.appState.user = { id: 0, name: '', token: '' }
            sessionStorage.removeItem(ONLINE_SESSION)
        }
    }
}