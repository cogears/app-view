<script lang="ts" setup>

const props = withDefaults(defineProps<{
    value: boolean,
    readonly?: boolean,
    disabled?: boolean,
}>(), {
    readonly: false,
    disabled: false,
})

const emits = defineEmits<{
    (e: 'update:value', value: boolean): void
    (e: 'change'): void
}>()
function onToggle() {
    emits('update:value', !props.value)
    emits('change')
}
</script>
<template>
    <a class="switcher border" :class="{ on: value, disabled: disabled, readonly: readonly }" @click="onToggle">
        <i class="circle"></i>
    </a>
</template>
<style scoped lang="scss">
.switcher {
    position: relative;
    display: inline-block;
    width: 3em;
    height: 1.5em;
    padding: 1px;
    border-radius: 100px;
    border-width: 1px;
    background-color: var(--color-frame);
    transition: all 0.3s;

    i {
        position: absolute;
        top: 1px;
        bottom: 1px;
        left: 1px;
        width: calc(1.5em - 4px);
        transition: all 0.3s;
        background-color: var(--color-white);
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
    }

    &.on {
        background-color: var(--color-app);

        i {
            left: calc(3em - 1.5em + 1px);
        }
    }
}
</style>
