<script lang='ts' setup>
import IconEye from '@/components/icons/IconEye.vue';
import IconEyeClose from '@/components/icons/IconEyeClose.vue';
import { IInput } from 'types';
import { inject, reactive, ref, watchEffect } from 'vue';
import ViewContext from '../ViewContext';

const context = inject(ViewContext.NAME) as ViewContext
const props = withDefaults(defineProps<{
    value?: string | number,
    placeholder?: string,
    round?: boolean,
    textarea?: boolean,
    password?: boolean,
    maxlength?: number,
    maxTip?: boolean,
    disabled?: boolean,
    readonly?: boolean,
}>(), {
    value: '',
    placeholder: '',
    round: false,
    textarea: false,
    password: false,
    maxlength: 99999,
    maxTip: false,
    disabled: false,
    readonly: false,
})
const emits = defineEmits<{
    (e: 'focus'): void;
    (e: 'blur'): void;
    (e: 'keydown', evt: KeyboardEvent): void;
    (e: 'update:value', value: string): void;
    (e: 'change'): void
}>()
const input = ref<HTMLInputElement>()
const temp = reactive({
    focus: false,
    content: '',
    eye: false,
})
defineExpose<IInput>({
    focus() {
        input.value?.focus()
    },
    blur() {
        input.value?.blur()
    }
})
watchEffect(() => {
    if (typeof props.value == 'number') {
        temp.content = props.value + ''
    } else {
        temp.content = props.value
    }
})

function onChanged() {
    emits('update:value', temp.content)
    emits('change')
}

function onFocus() {
    context.keyboard.pushMonopolyKeyboard()
    temp.focus = true
    emits('focus')
}
function onBlur() {
    context.keyboard.popMonopolyKeyboard()
    temp.focus = false
    emits('blur')
}
function onKeydown(e: KeyboardEvent) {
    emits('keydown', e)
}
</script>
<template>
    <div class="input frame border" :class="{ round: round, focus: temp.focus, textarea: textarea, disabled: disabled, readonly: readonly }">
        <slot name="prefix">
            <span class="blank"></span>
            <slot name="prefix-icon"></slot>
        </slot>
        <textarea v-if="textarea" ref="input" v-model="temp.content" :placeholder="placeholder" @input="onChanged" @focus="onFocus" @blur="onBlur" @keydown.stop="onKeydown" :readonly="readonly" :maxlength="maxlength" :disabled="disabled"></textarea>
        <input v-else ref="input" v-model="temp.content" :type="password && !temp.eye ? 'password' : 'text'" :placeholder="placeholder" :maxlength="maxlength" @input="onChanged" @focus="onFocus" @blur="onBlur" @keydown.stop="onKeydown" :readonly="readonly" :disabled="disabled">
        <slot name="suffix">
            <slot name="suffix-icon">
                <template v-if="password">
                    <IconEye class="search" @click="temp.eye = false" v-if="temp.eye"></IconEye>
                    <IconEyeClose class="search" @click="temp.eye = true" v-else></IconEyeClose>
                </template>
            </slot>
            <span class="blank"></span>
        </slot>
        <div class="max-tip" :class="{ red: temp.content.length == maxlength }" v-if="maxTip && typeof temp.content == 'string'">{{ temp.content.length }}/{{ maxlength }}
        </div>
    </div>
</template>
<style lang='scss' scoped>
.input {
    position: relative;
    display: flex;
    align-items: center;
    border-radius: var(--size-round);
    border-width: 1px;
    width: 20em;
    height: 2.5em;

    .max-tip {
        position: absolute;
        right: 4px;
        bottom: 4px;
        font-size: 12px;
    }

    .blank {
        width: var(--size-padding);
        height: var(--size-padding);
    }

    &.textarea {
        padding: var(--size-padding) 0;
        height: 10em;
    }

    &.round {
        border-radius: 100px;
    }

    &.focus {
        border-color: var(--color-app);
    }

    input,
    textarea {
        flex: 1;
        width: 100%;
        height: 100%;
        border: 0;
        outline: 0;
        background: transparent;
        text-align: inherit;
    }
}
</style>