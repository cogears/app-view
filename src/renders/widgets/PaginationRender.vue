<script setup lang="ts">
import { fetchValue } from '@/common';
import Pagination from '@/components/Pagination.vue';
import { ActionEvent, PaginationOptions, PaginationState } from 'types';
import { computed } from 'vue';
import { formatter } from '@/common';

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
    <div class="pagination-render">
        <span>共 {{ formatter.amount(paginationState.total, 0) }} 条</span>
        <Pagination v-model:page="paginationState.page" v-model:size="paginationState.size" :total="paginationState.total" @change="onChanged"></Pagination>
    </div>
</template>
<style scoped lang="scss">
.pagination-render {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 16px 0;
}
</style>