<script setup lang="ts">
import { fetchValue } from '@/common';
import Loading from '@/components/Loading.vue';
import { ActionEvent, ImageOptions } from 'types';
import { computed, reactive } from 'vue';

const props = defineProps<{
    options: ImageOptions,
    state: any,
}>()

const temp = reactive({
    loading: false,
})

const imageStyle = computed(() => {
    let css: any = {
    }
    if (props.options.width > 0) {
        css.width = props.options.width + 'px'
    }
    if (props.options.height > 0) {
        css.height = props.options.height + 'px'
    }
    return css
})
const imageUrl = computed(() => fetchValue(props.state, props.options.name))

const emits = defineEmits<{
    (e: 'action', event: ActionEvent): void
}>()

async function onClick() {
    if (props.options.onClick) {
        for (let action of props.options.onClick) {
            await new Promise((resolve, reject) => {
                emits('action', { action, resolve, reject })
            })
        }
    }
}
</script>
<template>
    <div class="image-render" :class="{ round: options.round }" :style="imageStyle" @click="onClick">
        <img :src="imageUrl">
        <Loading :visible="temp.loading"></Loading>
    </div>
</template>
<style scoped lang="scss">
.image-render {
    position: relative;
    background-color: var(--color-frame);
    overflow: hidden;

    img {
        width: 100%;
        height: 100%;
    }

    &.round {
        border-radius: 50%;
    }
}
</style>