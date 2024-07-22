<script setup lang="ts">
import { fetchValue, formatter } from '@/common';
import { ActionEvent, NodeOptions } from 'types';
import { computed } from 'vue';
import ButtonRender from './ButtonRender.vue';
import CheckboxRender from './CheckboxRender.vue';
import ContainerRender from './ContainerRender.vue';
import CustomRender from './CustomRender.vue';
import DateRangeRender from './DateRangeRender.vue';
import DateRender from './DateRender.vue';
import DialogRender from './DialogRender.vue';
import FormFieldRender from './FormFieldRender.vue';
import FormRender from './FormRender.vue';
import HtmlEditorRender from './HtmlEditorRender.vue';
import IFrameRender from './IFrameRender.vue';
import ImagerRender from './ImageRender.vue';
import InputRender from './InputRender.vue';
import ListRender from './ListRender.vue';
import PaginationRender from './PaginationRender.vue';
import RadioRender from './RadioRender.vue';
import SceneRender from './SceneRender.vue';
import SelectRender from './SelectRender.vue';
import SwitcherRender from './SwitcherRender.vue';
import TableRender from './TableRender.vue';
import TabPagesRender from './TabPagesRender.vue';
import TextRender from './TextRender.vue';
import TreeRender from './TreeRender.vue';
import UploaderRender from './UploaderRender.vue';

const props = defineProps<{
    options: NodeOptions,
    state: any,
}>()

const labelText = computed(() => props.options.label ? formatter.text(props.options.label, props.state) : '')
const visible = computed(() => props.options.visible ? fetchValue(props.state, props.options.visible) : true)
const noMargin = computed(() => props.options.dialog || !props.options.type)

const classNames = computed(() => {
    let arr: any[] = []
    if (props.options.style) {
        if (props.options.style.full) {
            arr.push('full')
        }
        if (props.options.style.border) {
            arr.push('border')
        }
    }
    if (noMargin.value) {
        arr.push('no-margin')
    }
    return arr
})

const style = computed(() => {
    let css: any = {}
    if (props.options.style) {
        if (props.options.style.width && props.options.style.width > 0) {
            css.width = props.options.style.width + 'px'
        }
        if (props.options.style.height && props.options.style.height > 0) {
            css.height = props.options.style.height + 'px'
        }
        if (props.options.style.padding && props.options.style.padding > 0) {
            css.padding = props.options.style.padding + 'px'
        }
    }
    return css
})

const emits = defineEmits<{
    (e: 'action', event: ActionEvent): void
}>()

function onAction(event: ActionEvent) {
    emits('action', event)
}

</script>
<template>
    <div class="node-render" :class="classNames" :style="style" v-if="visible">
        <label v-if="options.label">{{ labelText }}</label>
        <SceneRender v-if="options.type == 'scene' && options.scene" :options="options.scene" :state="state"
            @action="onAction" />
        <ContainerRender v-if="options.type == 'container' && options.container" :options="options.container"
            :state="state" @action="onAction" />
        <TextRender v-if="options.type == 'text' && options.text" :options="options.text" :state="state"
            @action="onAction" />
        <ImagerRender v-if="options.type == 'image' && options.image" :options="options.image" :state="state"
            @action="onAction" />
        <ButtonRender v-if="options.type == 'button' && options.button" :options="options.button" :state="state"
            @action="onAction" />
        <InputRender v-if="options.type == 'input' && options.input" :options="options.input" :state="state"
            @action="onAction" />
        <HtmlEditorRender v-if="options.type == 'html-editor' && options.htmlEditor" :options="options.htmlEditor"
            :state="state" @action="onAction" />
        <CheckboxRender v-if="options.type == 'checkbox' && options.checkbox" :options="options.checkbox" :state="state"
            @action="onAction" />
        <RadioRender v-if="options.type == 'radio' && options.radio" :options="options.radio" :state="state"
            @action="onAction" />
        <SelectRender v-if="options.type == 'select' && options.select" :options="options.select" :state="state"
            @action="onAction" />
        <TreeRender v-if="options.type == 'tree' && options.tree" :options="options.tree" :state="state"
            @action="onAction" />
        <SwitcherRender v-if="options.type == 'switcher' && options.switcher" :options="options.switcher" :state="state"
            @action="onAction" />
        <DateRender v-if="options.type == 'date' && options.date" :options="options.date" :state="state"
            @action="onAction" />
        <DateRangeRender v-if="options.type == 'date-range' && options.dateRange" :options="options.dateRange"
            :state="state" @action="onAction" />
        <UploaderRender v-if="options.type == 'uploader' && options.uploader" :options="options.uploader" :state="state"
            @action="onAction" />
        <TableRender v-if="options.type == 'table' && options.table" :options="options.table" :state="state"
            @action="onAction" />
        <PaginationRender v-if="options.type == 'pagination' && options.pagination" :options="options.pagination"
            :state="state" @action="onAction" />
        <DialogRender v-if="options.type == 'dialog' && options.dialog" :options="options.dialog" :state="state"
            @action="onAction" />
        <TabPagesRender v-if="options.type == 'tab-pages' && options.tabPages" :options="options.tabPages"
            :state="state" @action="onAction" />
        <FormRender v-if="options.type == 'form' && options.form" :options="options.form" :state="state"
            @action="onAction" />
        <FormFieldRender v-if="options.type == 'form-field' && options.formField" :options="options.formField"
            :state="state" @action="onAction" />
        <ListRender v-if="options.type == 'list' && options.list" :options="options.list" :state="state"
            @action="onAction" />
        <IFrameRender v-if="options.type == 'iframe' && options.iframe" :options="options.iframe" :state="state"
            @action="onAction" />
        <CustomRender v-if="options.type == 'custom' && options.custom" :options="options.custom" :state="state"
            @action="onAction" />
    </div>
</template>
<style scoped lang="scss">
.node-render {
    display: flex;
    align-items: center;

    >label {
        white-space: nowrap;
        margin-right: 4px;
    }

    &.full {
        flex: 1;
        width: 100%;
        height: 100%;
        overflow: hidden;
    }

    &.border {
        border-width: 1px;
        border-radius: 4px;
    }

    &.no-margin {
        margin: 0 !important;
    }
}
</style>