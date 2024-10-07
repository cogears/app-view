<script setup lang="ts">
import { fetchValue } from '@/common';
import Uploader from '@/components/Uploader.vue';
import ViewContext from '@/ViewContext';
import { ActionEvent, AppContext, AppContextType, UploaderOptions } from 'types';
import { computed, inject } from 'vue';
import { ACTION_VALIDATE_INPUT } from '../protocols';

const context = inject(ViewContext.NAME as AppContextType) as AppContext
const props = defineProps<{
    options: UploaderOptions,
    state: any,
}>()

const value = computed(() => fetchValue(props.state, props.options.name))

const emits = defineEmits<{
    (e: 'action', event: ActionEvent): void
}>()

async function onUpload(file: File): Promise<string> {
    if (context.appUpload) {
        return await context.appUpload.execute(context, [file, props.options.type], props.state)
    }
    throw new Error('应用未提供上传接口')
}

async function onChanged() {
    emits('action', { action: { name: ACTION_VALIDATE_INPUT, data: [] } })

    if (props.options.onChanged) {
        for (let action of props.options.onChanged) {
            await new Promise((resolve, reject) => {
                emits('action', { action, resolve, reject })
            })
        }
    }
}
</script>
<template>
    <Uploader :value="value" :type="options.type" :accept="options.accept" :limit="options.limit" :upload="onUpload" @change="onChanged">
    </Uploader>
</template>
<style scoped lang="scss"></style>