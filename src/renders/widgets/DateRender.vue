<script setup lang="ts">
import { fetchValue, setupValue } from '@/common';
import Calendar from '@/components/Calendar.vue';
import { ActionEvent, DateOptions } from 'types';
import { computed } from 'vue';
import { ACTION_VALIDATE_INPUT } from '../protocols';

const props = defineProps<{
    options: DateOptions,
    state: any,
}>()

const value = computed({
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
    <Calendar v-model:value="value" :disabled="disabled" @change="onChanged"></Calendar>
</template>
<style scoped lang="scss"></style>