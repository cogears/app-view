<script lang='ts' setup>
import { fetchValue, setupValue } from '@/common';
import Tree from '@/components/Tree.vue';
import { ActionEvent, TreeOptions } from 'types';
import { computed } from 'vue';

const props = defineProps<{
    options: TreeOptions,
    state: any,
}>()

const source = computed(() => typeof props.options.source == 'string' ? fetchValue(props.state, props.options.source) : props.options.source)
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
    if (props.options.onChanged) {
        for (let action of props.options.onChanged) {
            await new Promise((resolve, reject) => {
                emits('action', { action, resolve, reject })
            })
        }
    }
}

async function onContextMenu(e: MouseEvent) {
    if (props.options.onContextMenu) {
        let event = { clientX: e.clientX, clientY: e.clientY }
        for (let action of props.options.onContextMenu) {
            let data = [event, ...action.data]
            await new Promise((resolve, reject) => {
                emits('action', { action: { name: action.name, data }, resolve, reject })
            })
        }
    }
}
</script>
<template>
    <Tree :options="source" v-model:value="value" @change="onChanged" @contextmenu="onContextMenu"></Tree>
</template>
<style lang='scss' scoped></style>