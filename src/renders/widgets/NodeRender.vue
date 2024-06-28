<script setup lang="ts">
import { Action, NodeOptions } from 'types';
import { computed } from 'vue';
import ButtonRender from './ButtonRender.vue';
import ContainerRender from './ContainerRender.vue';
import ImagerRender from './ImageRender.vue';
import InputRender from './InputRender.vue';
import SceneRender from './SceneRender.vue';
import SelectRender from './SelectRender.vue';
import TextRender from './TextRender.vue';

const props = defineProps<{
    options: NodeOptions,
    state: any,
}>()

const style = computed(() => {
    let css: any = {}
    if (props.options.style.full) {
        css.flex = 1
    }
    if (props.options.style.width && props.options.style.width > 0) {
        css.width = props.options.style.width + 'px'
    }
    if (props.options.style.height && props.options.style.height > 0) {
        css.height = props.options.style.height + 'px'
    }
    return css
})

const emits = defineEmits<{
    (e: 'action', action: Action): void
}>()

function onAction(action: Action) {
    emits('action', action)
}

</script>
<template>
    <div class="node-render" :style="style">
        <SceneRender v-if="options.type == 'scene' && options.scene" :options="options.scene" />
        <ContainerRender v-if="options.type == 'container' && options.container" :options="options.container"
            :state="state" @action="onAction" />
        <TextRender v-if="options.type == 'text' && options.text" :options="options.text" :state="state"
            @action="onAction" />
        <ImagerRender v-if="options.type == 'image' && options.image" :options="options.image" :state="state"
            @action="onAction" />
        <ButtonRender v-if="options.type == 'button' && options.button" :options="options.button" :state="state"
            @action="onAction" />
        <SelectRender v-if="options.type == 'select' && options.select" :options="options.select" :state="state"
            @action="onAction" />
        <InputRender v-if="options.type == 'input' && options.input" :options="options.input" :state="state"
            @action="onAction" />
    </div>
</template>
<style scoped lang="scss"></style>