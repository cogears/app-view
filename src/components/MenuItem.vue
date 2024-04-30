<script setup lang="ts">
import { MenuOption } from 'types';
import { computed, reactive, ref } from 'vue';
import Checkbox from './Checkbox.vue';
import Menu from './Menu.vue';
import IconRight from './icons/IconRight.vue';

const props = defineProps<{
    item: MenuOption,
    mode?: 'checkbox'
}>()
const emits = defineEmits<{
    (e: 'selected', items: MenuOption[]): void
}>()
function onSelected(items: MenuOption[]) {
    emits('selected', [props.item, ...items])
}
const temp = reactive({
    created: false,
    y: 0,
    height: 0,
})

const style = computed(() => {
    let css: any = { top: temp.y - 4 + 'px' }
    if (temp.height > 0) {
        css.height = temp.height + 'px'
    }
    return css
})

const self = ref<HTMLDivElement>()
function onMouseOver() {
    if (!temp.created) {
        if (self.value && props.item.children && props.item.children.length > 0) {
            let h = props.item.children.length * 32
            let r = self.value.getBoundingClientRect()
            if (h > window.innerHeight) {
                temp.y = 32 - r.top
                temp.height = window.innerHeight - 64
            } else {
                if (r.top + h > window.innerHeight) {
                    if (r.top - h < 0) {
                        temp.y = 32 - r.top
                    } else {
                        temp.y = 32 - h
                    }
                }
            }
        }
        temp.created = true
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
            <IconRight class="more" :size="14" v-if="item.children && item.children.length > 0"></IconRight>
        </a>
        <Menu :options="item.children" :mode="mode" @selected="onSelected" :style="style"
            v-if="item.children && item.children.length > 0 && temp.created"></Menu>
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
        position: absolute;
        top: -4px;
        left: 100%;
        transform: translate(-4px, 0);
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