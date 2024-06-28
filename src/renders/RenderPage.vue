<script setup lang="ts">
import Loading from "@/components/Loading.vue";
import { AppContext, PageOptions } from "types";
import { inject, onMounted, reactive, ref, watch } from "vue";
import { useRoute } from "vue-router";
import SceneRender from "./widgets/SceneRender.vue";
import Works from './layouts/Works.vue'
import Login from './layouts/Login.vue'
import { ViewContext } from "..";

const context = inject(ViewContext.NAME) as AppContext
const route = useRoute()
const temp = reactive({
    loading: false,
    ready: false,
})
const pageSceneOptions = ref<PageOptions>()

onMounted(() => {
    if (context.isOnline()) {
        onLogged()
    }
    installPage()
})

watch(route, () => {
    uninstallPage()
    installPage()
})

function installPage() {
    console.info('install page', route.name, route.fullPath)
    pageSceneOptions.value = route.meta.options as PageOptions
    temp.loading = false
}

function uninstallPage() {
    console.info('uninstall page', route.name, route.fullPath)
    temp.loading = true
    pageSceneOptions.value = undefined
}

function onLogged() {
    temp.ready = true
}
</script>
<template>
    <Works v-if="temp.ready">
        <SceneRender :options="pageSceneOptions" v-if="pageSceneOptions && !temp.loading"></SceneRender>
        <Loading fixed :visible="temp.loading">加载中...</Loading>
    </Works>
    <Login v-else @logged="onLogged"></Login>
</template>
<style scoped lang="scss"></style>