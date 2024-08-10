<script setup lang="ts">
import { fetchValue } from '@/common';
import { IFrameOptions } from 'types';
import { computed } from 'vue';

const props = defineProps<{
    options: IFrameOptions,
    state: any,
}>()

const src = computed(() => fetchValue(props.state, props.options.name))
</script>
<template>
    <iframe class="iframe" :src="src"></iframe>
</template>
<style scoped lang="scss">
.iframe {
    width: 100%;
    height: 100%;
    border: 0;
}
</style>