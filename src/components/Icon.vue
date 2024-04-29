<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(defineProps<{
    size?: number,
    direction?: 'up' | 'down' | 'left'
}>(), {
    size: 20
})
const style = computed(() => ({
    width: props.size + 'px',
    height: props.size + 'px'
}))
</script>
<template>
    <div class="icon" :class="direction" :style="style">
        <slot></slot>
    </div>
</template>
<style scoped lang="scss">
.icon {
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