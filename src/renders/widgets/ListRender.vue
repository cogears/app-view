<script setup lang="ts">
import { fetchValue } from '@/common';
import { ListOptions } from 'types';
import { computed } from 'vue';
import NodeRender from './NodeRender.vue';

const props = defineProps<{
    options: ListOptions,
    state: any,
}>()

const source = computed(() => fetchValue(props.state, props.options.name))
</script>
<template>
    <div class="list-render">
        <NodeRender v-for="item in source" :options="options.content" :state="item"></NodeRender>
    </div>
</template>
<style scoped lang="scss"></style>