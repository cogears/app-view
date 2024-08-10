<script setup lang="ts">
defineProps<{
    direction?: 'up' | 'down' | 'left'
}>()
</script>
<template>
    <div class="icon" :class="direction">
        <slot></slot>
    </div>
</template>
<style scoped lang="scss">
.icon {
    width: 1em;
    height: 1em;

    &.left {
        transform: rotate(180deg);
    }

    &.up {
        transform: rotate(270deg);
    }

    &.down {
        transform: rotate(90deg);
    }
}
</style>