<script setup lang="ts">
import { ActionEvent, FormOptions } from 'types';
import { reactive } from 'vue';
import { ACTION_REGISTER_FORM_FIELD, ACTION_SUBMIT_FORM } from '../protocols';
import ContainerRender from './ContainerRender.vue';

const props = defineProps<{
    options: FormOptions,
    state: any,
}>()
const temp = reactive({
    submitting: false,
})

const fields: Array<{ name: string, label: string, validate: Function }> = []

const emits = defineEmits<{
    (e: 'action', event: ActionEvent): void
}>()

function onAction({ action, resolve, reject }: ActionEvent) {
    if (action.name == ACTION_REGISTER_FORM_FIELD) {
        fields.push(action.data[0])
        resolve && resolve()
        return
    }
    if (action.name == ACTION_SUBMIT_FORM) {
        return onSubmit({ action, resolve, reject })
    }
    emits('action', { action, resolve, reject })
}

async function onSubmit(event: ActionEvent) {
    if (temp.submitting) {
        event.reject && event.reject(new Error('重复提交'))
        return
    }
    temp.submitting = true
    try {
        let validateResult = fields.map(fields => fields.validate())
        let validCount = validateResult.filter(value => value).length
        if (validCount == fields.length) {
            for (let action of props.options.onSubmit) {
                await new Promise((resolve, reject) => {
                    emits('action', { action, resolve, reject })
                })
            }
            event.resolve && event.resolve()
        } else {
            event.reject && event.reject(new Error('数据不正确'))
        }
    } catch (e) {
        event.reject && event.reject(e)
    } finally {
        temp.submitting = false
    }
}

</script>
<template>
    <ContainerRender :options="options" :state="state" @action="onAction"></ContainerRender>
</template>
<style scoped lang="scss"></style>