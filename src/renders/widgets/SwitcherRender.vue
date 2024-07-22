<script setup lang="ts">
import { fetchValue, setupValue } from '@/common';
import Switcher from '@/components/Switcher.vue';
import { ActionEvent, SwitcherOptions } from 'types';
import { computed } from 'vue';

const props = defineProps<{
    options: SwitcherOptions,
    state: any,
}>()
const disabled = computed(() => props.options.disabled ? fetchValue(props.state, props.options.disabled) : false)
const value = computed({
    get() {
        return fetchValue(props.state, props.options.name)
    },
    set(value) {
        setupValue(props.state, props.options.name, value)
    }
})
const renderValue = computed({
    get() {
        return props.options.map ? props.options.map[value.value] : value.value
    },
    set(newValue) {
        if (props.options.map) {
            for (let k in props.options.map) {
                if (props.options.map[k] == newValue) {
                    value.value = k
                    break
                }
            }
        } else {
            value.value = newValue
        }
    }
})

const emits = defineEmits<{
    (e: 'action', event: ActionEvent): void
}>()

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
    <Switcher v-model:value="renderValue" :disabled="disabled" @change="onChanged"></Switcher>
</template>
<style scoped lang="scss">
.switcher {
    display: block;
}
</style>