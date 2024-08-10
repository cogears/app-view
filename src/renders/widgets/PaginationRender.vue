<script setup lang="ts">
import { fetchValue } from '@/common';
import Pagination from '@/components/Pagination.vue';
import { ActionEvent, PaginationOptions, PaginationState } from 'types';
import { computed } from 'vue';

const props = defineProps<{
    options: PaginationOptions,
    state: any,
}>()

const paginationState = computed<PaginationState>(() => {
    let value = fetchValue(props.state, props.options.name)
    if (value == undefined || value == null) {
        throw new Error('数据未定义：' + props.options.name)
    }
    return value
})

const emits = defineEmits<{
    (e: 'action', event: ActionEvent): void
}>()

async function onChanged() {
    if (props.options.onChanged) {
        for (let action of props.options.onChanged) {
            await new Promise((resolve, reject) => {
                emits('action', { action, resolve, reject })
            })
        }
    }
}
</script>
<template>
    <Pagination v-model:page="paginationState.page" :size="paginationState.size" :total="paginationState.total"
        @change="onChanged"></Pagination>
</template>
<style scoped lang="scss">
.pagination {
    width: 100%;
    padding: 16px 0;
}
</style>