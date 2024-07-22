<script setup lang="ts">
import { fetchValue, setupValue } from '@/common';
import HtmlEditor from '@/components/HtmlEditor.vue';
import ViewContext from '@/ViewContext';
import { AppContext, AppContextType, HtmlEditorOptions, } from 'types';
import { computed, inject } from 'vue';

const context = inject(ViewContext.NAME as AppContextType) as AppContext
const props = defineProps<{
    options: HtmlEditorOptions,
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

const upload = computed(() => {
    if (context.appUpload) {
        const uploadHandler = context.appUpload
        return (file: File) => {
            return uploadHandler.execute(context, file, props.state)
        }
    }
})

</script>
<template>
    <HtmlEditor v-model:value="value" :placeholder="options.placeholder" :upload="upload">
    </HtmlEditor>
</template>
<style scoped lang="scss">
.html-editor {
    height: 100%;
}
</style>