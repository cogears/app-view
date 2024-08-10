<script setup lang="ts">
import { inject, onMounted, reactive } from 'vue';
import Loading from '../components/Loading.vue'
import ViewContext from '../ViewContext';
import { LOADING } from './index';

const context = inject(ViewContext.NAME) as ViewContext
const temp = reactive({
    visible: false,
    message: ''
})

onMounted(() => {
    context.device.addEventListener(LOADING, onShow)
})

function onShow(_: string, visible: boolean, message: string) {
    temp.visible = visible
    temp.message = message
}
</script>
<template>
    <Loading :visible="temp.visible" fixed>
        <div v-html="temp.message"></div>
    </Loading>
</template>
<style scoped lang="scss"></style>