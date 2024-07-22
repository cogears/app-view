<script lang="ts" setup>
import { computed } from 'vue';
const props = withDefaults(defineProps<{
    value?: any,
    selected: Array<any> | boolean,
    disabled?: boolean,
    readonly?: boolean,
}>(), {
    value: '',
    disabled: false,
    readonly: false,
})
const emits = defineEmits<{
    (e: 'update:selected', value: any): void
    (e: 'change'): void
}>()

const isSelected = computed(() => {
    if (props.selected instanceof Array) {
        return props.selected.indexOf(props.value) >= 0;
    } else {
        return !!props.selected;
    }
})

function onSelected() {
    if (props.disabled || props.readonly) {
        return
    }
    if (props.selected instanceof Array) {
        let i = props.selected.indexOf(props.value);
        if (i >= 0) {
            props.selected.splice(i, 1);
        } else {
            props.selected.push(props.value);
        }
        emits('update:selected', props.selected)
    } else {
        emits('update:selected', !props.selected)
    }
    emits('change')
}
</script>
<template>
    <a class="checkbox" :class="{ disabled: disabled, readonly: readonly }" @click="onSelected">
        <input type="checkbox" :checked="isSelected" readonly>
        <span>
            <slot></slot>
        </span>
    </a>
</template>
<style scoped lang="scss">
.checkbox {
    display: flex;

    input {
        height: 1.5em;
        pointer-events: none;
    }

    span {
        flex: 1;
        overflow: hidden;
        margin-left: 2px;
    }
}
</style>