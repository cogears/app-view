<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(defineProps<{
    value?: any,
    selected: any,
    disabled?: boolean,
    readonly?: boolean,
}>(), {
    value: '',
    disabled: false,
    readonly: false,
});

const emits = defineEmits<{
    (e: 'update:selected', value: any): void;
    (e: 'change'): void
}>();

const isSelected = computed(() => {
    return props.selected == props.value
})

function onSelected() {
    emits('update:selected', props.value);
    emits('change')
}
</script>
<template>
    <a class="radio" :class="{ disabled: disabled, readonly: readonly }" @click="onSelected">
        <input type="radio" :checked="isSelected" readonly>
        <span>
            <slot></slot>
        </span>
    </a>
</template>
<style scoped lang="scss">
.radio {
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