<script setup lang="ts">
import { Option } from 'types';
import { reactive, ref, watchEffect } from 'vue';

const props = defineProps<{
    options: Option<any>[],
    value?: any,
}>()

const texts = ref<HTMLDivElement>()
const temp = reactive({
    x: 0,
    w: 0,
})

watchEffect(() => {
    let i = props.options.findIndex(item => item.key == props.value)
    if (i >= 0) {
        if (texts.value) {
            let child = texts.value.children[i]
            let r1 = child.getBoundingClientRect()
            let r0 = texts.value.getBoundingClientRect()
            temp.x = r1.left - r0.left
            temp.w = r1.width
        }
    } else {
        temp.x = -1
        temp.w = 0
    }
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
    <div class="switch-bar border frame">
        <div class="switch-bar-content">
            <div class="texts">
                <a v-for="item in options" @click="onSelected(item)">
                    {{ item.label }}
                </a>
            </div>
            <div class="thumb" :style="{ left: temp.x + 'px', width: temp.w + 'px' }" v-if="temp.w >= 0">
            </div>
            <div ref="texts" class="texts visible">
                <a v-for="item in options" :class="{ on: item.key == value }" @click="onSelected(item)">
                    {{ item.label }}
                </a>
            </div>
        </div>
    </div>
</template>
<style scoped lang="scss">
.switch-bar {
    border-width: 1px;
    padding: 1px;
    height: 2.5em;
    border-radius: var(--size-round);
    overflow: hidden;

    .switch-bar-content {
        position: relative;
        height: 100%;
    }

    .thumb {
        position: absolute;
        top: 0;
        bottom: 0;
        border-radius: var(--size-round);
        transition: all 0.3s;
        background-color: var(--color-app);
    }

    .texts {
        display: flex;
        align-items: center;
        opacity: 0;
        height: 100%;

        a {
            min-width: 2.5em;
            padding: 0 var(--size-padding);
            color: var(--color-text1);
            transition: all 0.3s;

            &.on {
                color: var(--color-white);
            }
        }

        &.visible {
            position: absolute;
            opacity: 1;
            left: 0;
            top: 0;
        }
    }
}
</style>