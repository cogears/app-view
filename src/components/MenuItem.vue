<script setup lang="ts">
import { MenuOption } from 'types';
import { computed, reactive, ref } from 'vue';
import Checkbox from './Checkbox.vue';
import Menu from './Menu.vue';
import IconRight from './icons/IconRight.vue';

const props = defineProps<{
    item: MenuOption<any>,
    mode?: 'checkbox'
}>()
const emits = defineEmits<{
    (e: 'selected', items: MenuOption<any>[]): void
}>()
function onSelected(items: MenuOption<any>[]) {
    emits('selected', [props.item, ...items])
}
const temp = reactive({
    x: 0,
    y: 0,
    height: 0,
})

const style = computed(() => {
    let css: any = {
        top: temp.y - 4 + 'px',
        left: temp.x - 4 + 'px'
    }
    if (temp.height > 0) {
        css.height = temp.height + 'px'
    }
    return css
})

const self = ref<HTMLDivElement>()
function onMouseOver() {
    if (self.value && props.item.children && props.item.children.length > 0) {
        const itemHeight = 32
        let r = self.value.getBoundingClientRect()
        temp.x = r.left + r.width
        temp.y = r.top
        let h = props.item.children.length * itemHeight
        if (h > window.innerHeight) {
            temp.y = itemHeight
            temp.height = window.innerHeight - itemHeight * 2
        } else {
            if (temp.y + h > window.innerHeight) {
                temp.y = temp.y - h + itemHeight
                if (temp.y < 0) {
                    temp.y = itemHeight
                }
            }
        }
    }
}

</script>
<template>
    <div ref="self" class="menu-item-wrap" :class="{ disabled: item.disabled }">
        <a class="menu-item" :class="{ selected: item.selected }" @mousedown="onSelected([])" @mouseover="onMouseOver">
            <div class="space">
                <Checkbox :selected="item.selected || false" v-if="mode == 'checkbox'">{{ item.label }}</Checkbox>
                <span v-else>{{ item.label }}</span>
            </div>
            <IconRight class="more" v-if="item.children && item.children.length > 0"></IconRight>
        </a>
        <Menu :options="item.children" :mode="mode" @selected="onSelected" :style="style" v-if="item.children && item.children.length > 0"></Menu>
    </div>
</template>
<style scoped lang="scss">
.menu-item-wrap {
    position: relative;

    .menu-item {
        position: relative;
        display: flex;
        align-items: center;
        height: var(--size-label);
        padding-left: 12px;
        padding-right: 12px;
        white-space: nowrap;

        &.selected {
            color: var(--color-app);
        }

        .more {
            margin-left: 12px;
            fill: var(--color-text2);
            transform: translate(4px, 0);
        }
    }

    .menu {
        position: fixed;
        display: none;
    }

    &:hover {
        background-color: var(--color-app);
        color: var(--color-white);

        >.menu {
            display: block;
        }

        >.menu-item {
            :deep(*) {
                color: var(--color-white);
                fill: var(--color-white);
            }
        }
    }
}
</style>