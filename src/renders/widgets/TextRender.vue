<script setup lang="ts">
import formatter from '@/common/formatter';
import Link from '@/components/Link.vue';
import { ActionEvent, TextOptions } from 'types';
import { computed } from 'vue';

const props = defineProps<{
    options: TextOptions,
    state: any,
}>()

const isLink = computed(() => props.options.onClick)

const cls = computed(() => {
    let arr: string[] = []
    if (props.options.color) {
        arr.push(props.options.color)
    }
    if (props.options.size) {
        arr.push(props.options.size)
    }
    return arr
})


const label = computed(() => formatter.text(props.options.label, props.state, '--'))

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
    <Link class="text-render" :color="options.color" :class="cls" v-if="isLink" @click="onClick">
    {{ label }}
    </Link>
    <span class="text-render" :class="cls" v-else>{{ label }}</span>
</template>
<style scoped lang="scss">
.text-render {
    white-space: wrap;
    word-break: break-all;
}
</style>