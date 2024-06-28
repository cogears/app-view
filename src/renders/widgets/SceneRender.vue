<script setup lang="ts">
import { SceneOptions } from 'types';
import { onBeforeUnmount, onMounted, ref, onBeforeMount } from 'vue';
import { copyValue } from '@/common/dataUtil';
import ContainerRender from './ContainerRender.vue';

const props = defineProps<{
    options: SceneOptions
}>()

const state = ref<any>({})

onBeforeMount(() => {
    state.value = copyValue(props.options.state)
})

onMounted(() => {
})

onBeforeUnmount(() => {
    dispose()
})


function dispose() {

}
</script>
<template>
    <div class="scene-render">
        <ContainerRender :options="options.view" :state="state"></ContainerRender>
    </div>
</template>
<style scoped lang="scss"></style>