<script setup lang="ts">
import { computed } from "vue";
import { Option } from "types";
const props = defineProps<{
    options: Option[],
    value: string,
}>()

const current = computed({
    get() {
        return props.value
    },
    set(value: string) {
        emits('update:value', value)
    }
})

const emits = defineEmits<{
    (e: 'update:value', value: string): void
    (e: 'change'): void
}>()

</script>
<template>
    <div class="com-accordion">
        <div class="item border" :class="{ on: current == item.key }" v-for="item in options">
            <a class="item-label frame" @click="current = item.key">{{ item.label }}</a>
            <Transition>
                <div class="item-container panel border" v-if="current == item.key">
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