<script setup lang="ts">
import { fetchValue, setupValue } from '@/common';
import Radio from '@/components/Radio.vue';
import { ActionEvent, Option, RadioOptions } from 'types';
import { computed } from 'vue';
import { ACTION_VALIDATE_INPUT } from '../protocols';

const props = defineProps<{
    options: RadioOptions,
    state: any,
}>()

const disabled = computed(() => props.options.disabled ? fetchValue(props.state, props.options.disabled) : false)
const source = computed<Option<any>[]>(() => typeof props.options.source == 'string' ? fetchValue(props.state, props.options.source) : props.options.source)
const value = computed({
    get() {
        return fetchValue(props.state, props.options.name)
    },
    set(value) {
        setupValue(props.state, props.options.name, value)
    }
})

const emits = defineEmits<{
    (e: 'action', event: ActionEvent): void
}>()

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
    <Radio v-for="item in source" :value="item.key" v-model:selected="value" :disabled="disabled" @change="onChanged">
        {{ item.label }}
    </Radio>
</template>
<style scoped lang="scss">
.radio {
    margin-right: 2.5em;
    height: 2.5em;
    align-items: center;
}
</style>