<script setup lang="ts">
import { fetchValue, setupValue } from '@/common';
import Checkbox from '@/components/Checkbox.vue';
import { ActionEvent, CheckboxOptions, Option } from 'types';
import { computed, reactive } from 'vue';
import { ACTION_VALIDATE_INPUT } from '../protocols';

const props = defineProps<{
    options: CheckboxOptions,
    state: any,
}>()

const temp = reactive({
    selectAll: false,
})

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

function onSelectAllChanged() {
    if (temp.selectAll) {
        value.value = source.value.map(item => item.key)
    } else {
        value.value = []
    }
}

async function onChanged() {
    if (props.options.showAll) {
        temp.selectAll = value.value.length == source.value.length
    }

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
    <Checkbox v-model:selected="temp.selectAll" :disabled="disabled" v-if="options.showAll"
        @change="onSelectAllChanged">全部</Checkbox>
    <Checkbox v-for="item in source" :value="item.key" v-model:selected="value" :disabled="disabled"
        @change="onChanged">
        {{ item.label }}
    </Checkbox>
</template>
<style scoped lang="scss">
.checkbox {
    margin-right: 2.5em;
    height: 2.5em;
    align-items: center;
}
</style>