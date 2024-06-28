<script setup lang="ts">
import { ContainerOptions } from 'types';
import NodeRender from './NodeRender.vue';
import { computed } from 'vue';

const props = defineProps<{
    options: ContainerOptions,
    state: any,
}>()

const classnames = computed(() => {
    let arr: string[] = [props.options.direction || 'row']
    return arr
})

</script>
<template>
    <div class="container-render" :class="classnames">
        <NodeRender v-for="item in options.children" :options="item" :state="state"></NodeRender>
    </div>
</template>
<style scoped lang="scss">
.container-render {
    display: flex;

    &.row {
        flex-direction: row;
    }

    &.column {
        flex-direction: column;
    }
}
</style>