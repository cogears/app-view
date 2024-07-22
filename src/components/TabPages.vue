<script setup lang="ts">
import { Option } from 'types';

withDefaults(defineProps<{
    options: Option<any>[],
    value: any,
    border?: boolean,
    full?: boolean,
    readonly?: boolean,
}>(), {
    border: true,
    readonly: false,
})
const emits = defineEmits<{
    (e: 'update:value', value: any): void
    (e: 'change'): void
}>()

function onSelected(item: Option<any>) {
    emits('update:value', item.key)
    emits('change')
}
</script>
<template>
    <div class="tab-pages" :class="{ border: border, full: full }">
        <div class="tab-pages-bar frame" :class="{ readonly: readonly }">
            <a class="tab-bar-item border" v-for="item in options" :class="{ on: value == item.key }"
                @click="onSelected(item)">
                <slot name="tab" :item="item">
                    <div class="tab-bar-item-inner">{{ item.label }}</div>
                </slot>
            </a>
            <span class="space border">
                <slot name="suffix"></slot>
            </span>
        </div>
        <div class="tab-contents">
            <slot></slot>
            <slot :name="value"></slot>
        </div>
    </div>
</template>
<style scoped lang="scss">
.tab-pages {
    display: flex;
    flex-direction: column;
    width: 100%;
    min-height: 100px;

    .tab-pages-bar {
        display: flex;

        .tab-bar-item {
            color: var(--color-text2);
            border-bottom-width: 1px;
            border-right-width: 1px;

            &:hover {
                color: var(--color-text1);
            }

            &.on {
                color: var(--color-text1);
                background-color: var(--color-panel);
                border-bottom-color: transparent;
            }
        }

        .tab-bar-item-inner {
            line-height: 29px;
            padding: 0 8px;
            text-align: center;
        }

        .space {
            height: 100%;
            border-bottom-width: 1px;
        }
    }

    .tab-contents {
        flex: 1;
        overflow: auto;
    }

    &.border {
        border-width: 1px;
        border-style: solid;
    }

    &.full {
        height: 100%;
        flex: 1;
        overflow: hidden;
    }
}
</style>