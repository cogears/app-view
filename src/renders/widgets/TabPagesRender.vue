<script setup lang="ts">
import { fetchValue, setupValue } from '@/common';
import Loading from '@/components/Loading.vue';
import TabPages from '@/components/TabPages.vue';
import { ActionEvent, Option, TabPagesOptions } from 'types';
import { computed, onMounted, reactive } from 'vue';
import SceneRender from './SceneRender.vue';

const props = defineProps<{
    options: TabPagesOptions,
    state: any,
}>()
const value = computed({
    get() {
        return fetchValue(props.state, props.options.name)
    },
    set(value) {
        setupValue(props.state, props.options.name, value)
    }
})
const tabOptions = computed<Option<string>[]>(() => props.options.pages.map(item => (
    {
        key: item.name,
        label: item.name
    }
)))
const tabItem = computed(() => props.options.pages.find(item => item.name === value.value))

const temp = reactive({
    loading: false,
})

const emits = defineEmits<{
    (e: 'action', action: ActionEvent): void
}>()

onMounted(() => {
    if (!value.value) {
        if (props.options.pages.length > 0) {
            value.value = props.options.pages[0].name
        }
    }
})

function onLoading(value: boolean) {
    temp.loading = value
}

function onAction(action: ActionEvent) {
    emits('action', action)
}

</script>
<template>
    <TabPages :options="tabOptions" v-model:value="value" full>
        <SceneRender :options="tabItem" :state="state" @loading="onLoading" @action="onAction" v-if="tabItem" />
        <Loading :visible="temp.loading"></Loading>
    </TabPages>
</template>
<style scoped lang="scss">
.tab-pages {
    position: relative;
}
</style>