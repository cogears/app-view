<script setup lang="ts">
import { Login1, Works1 } from "@/layouts";
import { AppContext, AppContextType, SceneOptions } from "types";
import { computed, inject, onMounted, reactive } from "vue";
import ViewContext from "../ViewContext";
import SceneRender from "./widgets/SceneRender.vue";

const context = inject(ViewContext.NAME as AppContextType) as AppContext
const temp = reactive({
    ready: false,
})
const pageSceneOptions = computed(() => context.router.currentRoute.value.meta.options as SceneOptions<any>)
const appState = computed(() => context.appState)
const navigators = computed(() => context.appNavigators)

onMounted(() => {
    if (context.isOnline()) {
        onLogged()
    }
})

async function onLogin(username: string, password: string) {
    if (context.appLogin) {
        const body = { username, password }
        let user = await context.appLogin.execute(context, body, {})
        context.setOnline(user)
        onLogged()
        return
    }
    throw new Error('应用未提供登录接口')
}

function onLogged() {
    temp.ready = true
}

function onQuit() {
    context.setOnline()
    window.location.reload()
}
</script>
<template>
    <Works1 full :appName="appState.name" :appLogo="appState.logo" :navigators="navigators" :userName="appState.user.name" @quit="onQuit" v-if="temp.ready">
        <SceneRender :options="pageSceneOptions" :state="{}" isRoot v-if="pageSceneOptions"></SceneRender>
    </Works1>
    <Login1 :appName="appState.name" :background="appState.background" :login="onLogin" v-else>
        <template #tip>注意：如忘记账号密码, 请联系管理员。</template>
    </Login1>
</template>
<style scoped lang="scss"></style>