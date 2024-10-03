<script setup lang="ts">
import { fetchValue, setupValue } from '@/common';
import Combobox from '@/components/Combobox.vue';
import { ActionEvent, SelectOptions } from 'types';
import { computed } from 'vue';
import { ACTION_VALIDATE_INPUT } from '../protocols';

const props = defineProps<{
    options: SelectOptions,
    state: any,
}>()

const source = computed(() => typeof props.options.source == 'string' ? fetchValue(props.state, props.options.source) : props.options.source)
const disabled = computed(() => props.options.disabled ? fetchValue(props.state, props.options.disabled) : false)
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
    <Combobox :options="source" v-model:value="value" :placeholder="options.placeholder" :inputMode="options.inputMode" :clearVisible="true" :disabled="disabled" @change="onChanged"></Combobox>
</template>
<style scoped lang="scss">
.combobox {
    flex: 1;
}
</style>