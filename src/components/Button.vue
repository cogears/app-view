<script setup lang="ts">
import { computed } from 'vue';
import Loading from './Loading.vue';

const props = withDefaults(defineProps<{
    color?: string,
    theme?: 'normal' | 'line',
    round?: boolean,
    on?: boolean,
    readonly?: boolean,
    disabled?: boolean,
    loading?: boolean,
}>(), {
    color: 'app',
    theme: 'normal',
    round: false,
    disabled: false,
})

const classNames = computed(() => {
    let arr: string[] = [props.color, props.theme]
    if (props.round) {
        arr.push('round')
    }
    if (props.disabled || props.loading) {
        arr.push('disabled')
    } else if (props.readonly) {
        arr.push('readonly')
    }
    if (props.on) {
        arr.push('on')
    }
    return arr
})
</script>
<template>
    <a class="btn" :class="classNames">
        <slot></slot>
        <Loading :visible="props.loading"></Loading>
    </a>
</template>
<style scoped lang="scss">
.btn {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 2.5em;
    padding: 0 1em;
    border-radius: var(--size-round);

    &.normal {
        background-color: var(--color);
        color: var(--color-white);

        &:hover {
            background-color: hsl(from var(--color) h s calc(l * 1.2));
        }

        &:active {
            background-color: hsl(from var(--color) h s calc(l * 0.8));
        }
    }

    &.line {
        border: 1px solid var(--color);
        color: var(--color);
    }

    &.round {
        border-radius: 100px;
    }

    &.app {
        --color: var(--color-app);
    }

    &.blue {
        --color: var(--color-blue);
    }

    &.red {
        --color: var(--color-red);
    }

    &.green {
        --color: var(--color-green);
    }

    &.orange {
        --color: var(--color-orange);
    }

    &.yellow {
        --color: var(--color-yellow);
    }

    &.purple {
        --color: var(--color-purple);
    }

    &.magenta {
        --color: var(--color-magenta);
    }

    &.cyan {
        --color: var(--color-cyan);
    }

    &.gray {
        --color: var(--color-gray)
    }
}
</style>