<script setup lang="ts">
import { fetchValue, formatter } from '@/common';
import Dialog from '@/components/Dialog.vue';
import { ActionEvent, DialogOptions, DialogState } from 'types';
import { computed, reactive } from 'vue';
import { ACTION_CLOSE_DIALOG } from '../protocols';
import SceneRender from './SceneRender.vue';

const props = defineProps<{
    options: DialogOptions<any>,
    state: any,
}>()
const temp = reactive({
    loading: false,
})
const dialogState = computed<DialogState>(() => {
    let value = fetchValue(props.state, props.options.name)
    if (value == undefined || value == null) {
        throw new Error('数据未定义：' + props.options.name)
    }
    return value
})
const visible = computed({
    get() {
        return dialogState.value.visible
    },
    set(value) {
        dialogState.value.visible = value
    }
})

const title = computed(() => formatter.text(props.options.title, props.state))


const emits = defineEmits<{
    (e: 'action', event: ActionEvent): void
}>()

function onAction(event: ActionEvent) {
    if (event.action.name == ACTION_CLOSE_DIALOG) {
        visible.value = false
        if (event.resolve) {
            event.resolve()
        }
        return
    }
    emits('action', event)
}

function onLoading(value: boolean) {
    temp.loading = value
}

</script>
<template>
    <Dialog :title="title" :width="options.width" :height="options.height" v-model:visible="visible"
        :loading="temp.loading">
        <SceneRender :options="options" :state="state" @loading="onLoading" @action="onAction">
        </SceneRender>
    </Dialog>
</template>
<style scoped lang="scss"></style>