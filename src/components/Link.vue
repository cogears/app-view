<script setup lang="ts">
import { computed } from 'vue';
import IconNext from './icons/IconNext.vue'

const props = withDefaults(defineProps<{
    color?: string,
    more?: boolean,
    actived?: boolean,
    disabled?: boolean,
}>(), {
    color: 'app',
    more: false,
    actived: false,
    disabled: false,
})

const cls = computed(() => {
    let arr: string[] = []
    if (props.color) {
        arr.push(props.color)
    }
    if (props.actived) {
        arr.push('actived')
    }
    if (props.disabled) {
        arr.push('disabled')
    }
    return arr
})

</script>
<template>
    <a class="link" :class="cls">
        <slot></slot>
        <IconNext :size="14" v-if="more"></IconNext>
    </a>
</template>
<style scoped lang="scss">
.link {
    display: flex;
    align-items: center;

    &.app {
        color: var(--color-app);

        .icon {
            fill: var(--color-app);
        }
    }

    &:hover,
    &.actived {
        text-decoration: underline;
    }
}
</style>