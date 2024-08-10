<script setup lang="ts">
import { Option } from "types";
defineProps<{
    options: Option<any>[],
    value: any,
}>()

const emits = defineEmits<{
    (e: 'update:value', value: any): void
    (e: 'change'): void
}>()

function onChanged(value: any) {
    emits('update:value', value)
    emits('change')
}

</script>
<template>
    <div class="com-accordion">
        <div class="item border" :class="{ on: value == item.key }" v-for="item in options">
            <a class="item-label frame" @click="onChanged(item.key)">{{ item.label }}</a>
            <Transition>
                <div class="item-container panel border" v-if="value == item.key">
                    <slot :name="'item-' + item.key"></slot>
                </div>
            </Transition>
        </div>
    </div>
</template>
<style scoped lang="scss">
.com-accordion {
    width: 100%;
    height: 100%;

    display: flex;
    flex-direction: column;

    .item {
        display: flex;
        flex-direction: column;
        transition: all 0.3s;

        &+.item {
            border-top-width: 1px;
        }

        .item-label {
            display: flex;
            align-items: center;
            height: 2em;
            padding: 0 var(--size-padding);
        }

        .item-container {
            overflow: hidden;
        }

        &.on {
            flex: 1;

            .item-container {
                flex: 1;
                overflow: auto;
                border-top-width: 1px;
            }
        }
    }
}
</style>