<script lang="ts">
export default {
    name: 'TreeNode'
}
</script>
<script lang='ts' setup>
import { MenuOption } from 'types';
import { computed } from 'vue';
import IconRight from './icons/IconRight.vue';

const props = defineProps<{
    option: MenuOption<any>,
    depth: number,
    value: string[],
}>()
const selected = computed(() => props.value[props.value.length - 1])
const hasChildren = computed(() => props.option.children && props.option.children.length > 0)
const style = computed(() => ({
    paddingLeft: (1 * props.depth) + 'em'
}))

const emits = defineEmits<{
    (e: 'select', keys: string[]): void
    (e: 'contextmenu', event: MouseEvent): void
}>()

function onClick() {
    props.option.selected = !props.option.selected
    onSelect([])
}

function onContextMenu(e: MouseEvent) {
    onSelect([])
    emits('contextmenu', e)
}

function onSelect(keys: string[]) {
    emits('select', [props.option.key, ...keys])
}

</script>
<template>
    <div class="tree-node">
        <a class="current" :class="{ on: option.key == selected }" :style="style" @click="onClick" @contextmenu.stop.prevent="onContextMenu">
            <span class="prefix-icon">
                <IconRight v-if="hasChildren" :direction="option.selected ? 'down' : 'right'"></IconRight>
            </span>
            <label>{{ option.label }}</label>
        </a>
        <div class="children" v-if="hasChildren && option.selected">
            <TreeNode v-for="child in option.children" :option="child" :depth="depth + 1" :value="value" @select="onSelect" @contextmenu="emits('contextmenu', $event)"></TreeNode>
        </div>
    </div>
</template>
<style lang='scss' scoped>
.current {
    display: block;
    min-width: 100%;
    width: fit-content;
    height: 2.5em;
    line-height: 2.5em;
    white-space: nowrap;

    &:hover {
        background-color: var(--color-hover);
    }

    &.on {
        background-color: var(--color-selected);
    }

    .prefix-icon {
        display: inline-block;
        width: 16px;
        padding: 0 2px;
        font-size: 12px;
        fill: var(--color-text3);
    }
}
</style>