<script setup lang="ts">
import { fetchValue } from '@/common';
import { ActionEvent, ListOptions } from 'types';
import { computed } from 'vue';
import NodeRender from './NodeRender.vue';

const props = defineProps<{
    options: ListOptions,
    state: any,
}>()

const source = computed(() => fetchValue(props.state, props.options.name))

const emits = defineEmits<{
    (e: 'action', event: ActionEvent): void
}>()
function onAction({ action, resolve, reject }: ActionEvent, item: any) {
    action = {
        name: action.name,
        data: [item, ...action.data]
    }
    emits('action', { action, resolve, reject })
}
</script>
<template>
    <div class="list-render">
        <NodeRender v-for="item in source" :options="options.content" :state="item" @action="onAction($event, item)"></NodeRender>
    </div>
</template>
<style scoped lang="scss">
.list-render {
    width: 100%;

    .node-render {
        padding: 1em 0;
        border-bottom: 1px solid var(--color-border);
    }
}
</style>