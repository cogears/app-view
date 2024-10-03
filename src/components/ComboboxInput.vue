<script setup lang="ts">
import { reactive, ref } from 'vue';
import IconRight from './icons/IconRight.vue';

const props = withDefaults(defineProps<{
    onDrop?: (rect: DOMRect) => void,
    placeholder?: string,
    disabled?: boolean,
    readonly?: boolean,
    frameless?: boolean,
    focus?: boolean,
}>(), {
    placeholder: '请选择...',
    disabled: false,
    readonly: false,
    frameless: false,
    focus: false,
})
const self = ref<HTMLDivElement>()
const temp = reactive({
    dropVisible: false
})

async function onShowDropMenu() {
    if (self.value) {
        temp.dropVisible = true
        if (props.onDrop) {
            await props.onDrop(self.value.getBoundingClientRect())
        }
        temp.dropVisible = false
    }
}
</script>
<template>
    <a class="combobox current frame border" ref="self" :class="{ focus: temp.dropVisible || focus, disabled: disabled, readonly: readonly, frameless: frameless }" @click="onShowDropMenu">
        <span class="space line1 text1">
            <slot><label class="placeholder text3">{{ placeholder }}</label></slot>
        </span>

        <div class="arrow">
            <slot name="suffix">
                <IconRight :direction="temp.dropVisible ? 'up' : 'down'"></IconRight>
            </slot>
        </div>
    </a>
</template>
<style scoped lang="scss">
.combobox {
    display: flex;
    align-items: center;
    border-radius: var(--size-round);
    border-width: 1px;
    padding: 0 var(--size-padding);
    width: 10em;
    height: 2.5em;

    .arrow {
        fill: var(--color-text3);
        margin-left: var(--size-padding);
    }

    &:hover {
        .arrow {
            fill: var(--color-text1);
        }
    }

    &.focus {
        border-color: var(--color-app);

        .arrow {
            fill: var(--color-text1);
        }
    }

    &.frameless {
        border: 0 !important;
        background-color: transparent !important;
        color: inherit !important;
    }
}
</style>