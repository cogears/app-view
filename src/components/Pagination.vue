<script setup lang="ts">
import { computed, ref, watchEffect } from "vue";
import Combobox from "./Combobox.vue";
const emits = defineEmits<{
    (e: "update:page", value: number): void,
    (e: 'update:size', value: number): void,
    (e: 'change'): void,
}>();
const props = withDefaults(defineProps<{
    total: number;
    size: number;
    page?: number;
}>(), {
    total: 0,
    size: 10,
    page: 0
});
const current = ref<number>(0)
const totalPages = computed(() => Math.ceil(props.total / props.size));
const pages = computed(() => {
    let arr = [current.value - 2, current.value - 1, current.value, current.value + 1, current.value + 2];
    arr = arr.slice(0, totalPages.value);
    if (arr[0] < 0) {
        arr = arr.map((v) => v - arr[0]);
    } else if (arr[arr.length - 1] + 1 > totalPages.value) {
        arr = arr.map((v) => v - (arr[arr.length - 1] + 1 - totalPages.value));
    }
    return arr;
});
const pageSize = computed({
    get() {
        return props.size + ''
    },
    set(value) {
        emits('update:size', +value)
    }
})
const sizes = ref([
    { key: 20, label: '20/页' },
    { key: 50, label: '50/页' },
    { key: 100, label: '100/页' },
])

watchEffect(() => {
    current.value = props.page
})

function goTo(page: number) {
    if (page < 0) {
        page = 0;
    } else if (page > totalPages.value - 1) {
        page = totalPages.value - 1;
    }
    if (current.value == page) {
        return
    }
    current.value = page
    emits('update:page', page)
    emits('change')
}

function onSizeChange() {
    current.value = 0
    emits('update:page', 0)
    emits('change')
}
</script>
<template>
    <div class="pagination text3">
        <a class="btn border text2" :class="{ disabled: current == 0 }" @click="goTo(0)">第一页</a>
        <a class="btn border text2" :class="{ disabled: current == 0 }" @click="goTo(current - 1)">上一页</a>
        <span v-if="pages[0] > 0">...</span>
        <a class="btn border text2 numbers" v-for="n in pages" :key="n" :class="{ on: n == current }" @click="goTo(n)">{{ n +
            1
            }}</a>
        <span v-if="pages[pages.length - 1] < totalPages - 1">...</span>
        <a class="btn border text2" :class="{ disabled: current == totalPages - 1 || total == 0 }" @click="goTo(current + 1)">下一页</a>
        <a class="btn border text2" :class="{ disabled: current == totalPages - 1 || total == 0 }" @click="goTo(totalPages - 1)">最后一页</a>
        <Combobox :options="sizes" v-model:value="pageSize" @change="onSizeChange"></Combobox>
    </div>
</template>
<style scoped lang="scss">
.pagination {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;

    .btn {
        margin: 0 5px;
        padding: 0 5px;
        height: 20px;
        line-height: 18px;
        border-radius: 2px;
        border-width: 1px;
        text-align: center;

        &:hover {
            color: var(--color-app);
            border-color: var(--color-app);
        }

        &.on {
            background-color: var(--color-app);
            border-color: var(--color-app);
            color: var(--color-white);
        }
    }

    .combobox {
        width: 90px;
        height: 20px;
    }
}
</style>