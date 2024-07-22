<script lang='ts' setup>
import { MenuOption } from 'types';
import TreeNode from './TreeNode.vue';

withDefaults(defineProps<{
    options: MenuOption<any>[],
    value: string[],
    border?: boolean,
}>(), {
    border: true,
})

const emits = defineEmits<{
    (e: 'update:value', keys: string[]): void,
    (e: 'change'): void,
    (e: 'contextmenu', event: MouseEvent): void
}>()

function onSelect(keys: string[]) {
    emits('update:value', keys)
    emits('change')
}

function onContextMenu(e: MouseEvent) {
    onSelect([])
    emits('contextmenu', e)
}

</script>
<template>
    <div class="tree" :class="{ border: border }" @contextmenu="onContextMenu">
        <TreeNode v-for="item in options" :option="item" :depth="0" :value="value" @select="onSelect"
            @contextmenu="emits('contextmenu', $event)">
        </TreeNode>
    </div>
</template>
<style lang='scss' scoped>
.tree {
    width: 100%;
    height: 100%;
    border-width: 1px;
    border-radius: 4px;
    overflow: auto;
}
</style>