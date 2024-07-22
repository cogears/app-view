<script setup lang="ts">
import { fetchValue } from '@/common';
import { ActionEvent, CustomViewOptions } from 'types';
import { computed } from 'vue';

const props = defineProps<{
    options: CustomViewOptions,
    state: any
}>()
const input = computed(() => fetchValue(props.state, props.options.input))

const emits = defineEmits<{
    (e: 'action', event: ActionEvent): void,
}>()

function onAction(e: ActionEvent) {
    emits('action', e)
}

</script>
<template>
    <component :is="options.view" :options="input" :state="state" @action="onAction"></component>
</template>
<style scoped lang="scss"></style>