<script setup lang="ts">
import ViewContext from '@/ViewContext';
import { copyValue, fetchValue } from '@/common/dataUtil';
import { ActionEvent, AppContext, AppContextType, SceneOptions } from 'types';
import { computed, inject, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';
import NodeRender from './NodeRender.vue';

const context = inject(ViewContext.NAME as AppContextType) as AppContext
const props = defineProps<{
    options: SceneOptions<any>,
    state: any,
    isRoot?: boolean,
}>()

const sceneState = ref({})
const input = computed(() => props.options.input ? fetchValue(props.state, props.options.input) : {})
const output = computed(() => props.options.output ? fetchValue(sceneState.value, props.options.output) : {})
const temp = reactive({
    loading: true,
})
const emits = defineEmits<{
    (e: 'loading', value: boolean): void,
    (e: 'action', event: ActionEvent): void,
}>()

onMounted(() => {
    install()
})

onBeforeUnmount(() => {
    uninstall()
})

watch(() => props.options, async () => {
    try {
        await uninstall()
    } finally {
        setTimeout(() => {
            install()
        }, 50);
    }
})

watch(input, () => {
    start()
})

async function install() {
    sceneState.value = copyValue(props.options.state)
    if (props.options.onInit) {
        for (let action of props.options.onInit) {
            await new Promise((resolve, reject) => {
                onAction({ action, resolve, reject })
            })
        }
    }
    temp.loading = false
    emits('loading', temp.loading)
    start()
}

async function uninstall() {
    temp.loading = true
    emits('loading', temp.loading)
    if (props.options.onDispose) {
        for (let action of props.options.onDispose) {
            await new Promise((resolve, reject) => {
                onAction({ action, resolve, reject })
            })
        }
    }
    sceneState.value = {}
}

async function start() {
    if (props.options.onStart) {
        for (let action of props.options.onStart) {
            await new Promise((resolve, reject) => {
                onAction({ action, resolve, reject })
            })
        }
    }
}

async function onAction({ action, resolve, reject }: ActionEvent) {
    let controller = props.options.controllers.find(item => item.name == action.name)
    if (controller) {
        try {
            let data = action.data
            if (!props.isRoot) {
                data = [input.value, ...action.data]
            }
            let result = await controller.execute(context, data, sceneState.value)
            resolve && resolve(result)
        } catch (e) {
            if (reject) {
                reject(e)
            } else {
                throw e
            }
        }
    } else {
        if (props.isRoot) {
            reject && reject(new Error('not found controller: ' + action.name))
        } else {
            let data = [output.value, ...action.data]
            emits('action', { action: { name: action.name, data }, resolve, reject })
        }
    }
}
</script>
<template>
    <NodeRender :options="options.view" :state="sceneState" @action="onAction" v-if="!temp.loading">
    </NodeRender>
</template>
<style scoped lang="scss"></style>