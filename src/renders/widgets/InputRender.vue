<script setup lang="ts">
import { fetchValue, setupValue } from '@/common';
import Input from '@/components/Input.vue';
import { ActionEvent, InputOptions } from 'types';
import { computed } from 'vue';
import { ACTION_VALIDATE_INPUT } from '../protocols';

const props = defineProps<{
    options: InputOptions,
    state: any,
}>()

const isNumber = computed(() => props.options.type == 'number')
const value = computed<any>({
    get() {
        return fetchValue(props.state, props.options.name)
    },
    set(value) {
        setupValue(props.state, props.options.name, value)
    }
})

const disabled = computed(() => props.options.disabled ? fetchValue(props.state, props.options.disabled) : false)

const emits = defineEmits<{
    (e: 'action', event: ActionEvent): void
}>()

function onBlur() {
    if (isNumber.value) {
        let v = parseFloat(value.value)
        if (isNaN(v)) {
            value.value = ''
        } else {
            value.value = v
        }
    }
    emits('action', { action: { name: ACTION_VALIDATE_INPUT, data: [] } })
}

async function onChanged() {
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
    <Input v-model:value="value" :placeholder="options.placeholder" :textarea="options.textarea" :disabled="disabled"
        :maxlength="options.maxlength" :maxTip="!!(options.maxlength && options.maxlength > 0)" @blur="onBlur"
        @change="onChanged"></Input>
</template>
<style scoped lang="scss">
.input {
    flex: 1;

    &.textarea {
        height: 100%;
    }
}
</style>