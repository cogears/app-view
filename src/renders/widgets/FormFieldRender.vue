<script setup lang="ts">
import { fetchValue } from '@/common';
import { ActionEvent, FormFieldOptions } from 'types';
import { computed, onMounted, reactive, ref } from 'vue';
import { ACTION_REGISTER_FORM_FIELD, ACTION_VALIDATE_INPUT } from '../protocols';
import * as utils from '../utils';
import NodeRender from './NodeRender.vue';
const props = defineProps<{
    options: FormFieldOptions,
    state: any,
}>()

const classNames = computed(() => {
    let arr: string[] = [props.options.align || 'right']
    if (temp.error) {
        arr.push('error')
    }
    return arr
})

const temp = reactive({
    error: false,
})
const self = ref<HTMLDivElement>()

const emits = defineEmits<{
    (e: 'action', event: ActionEvent): void
}>()

onMounted(() => {
    emits('action', {
        action: {
            name: ACTION_REGISTER_FORM_FIELD,
            data: [{
                label: props.options.label,
                name: props.options.name,
                validate
            }]
        }
    })
})

function validate() {
    if (props.options.name) {
        let value = fetchValue(props.state, props.options.name)
        let result = validate0(value)
        temp.error = !result
        if (temp.error && self.value) {
            self.value.scrollIntoView({ behavior: "smooth", block: "center" })
        }
        return result
    }
    return true
}

function validate0(value: any) {
    if (props.options.require && utils.isNull(value)) {
        return false
    }
    if (props.options.validate) {
        if (props.options.validate == 'phone') {
            return utils.isPhone(value)
        } else if (props.options.validate == 'email') {
            return utils.isEmail(value)
        } else if (props.options.validate instanceof RegExp) {
            return props.options.validate.test(value)
        } else if (typeof props.options.validate == 'function') {
            return props.options.validate(value, props.state)
        }
    }
    return true
}

function onAction({ action, resolve, reject }: ActionEvent) {
    if (action.name == ACTION_VALIDATE_INPUT) {
        let result = validate()
        resolve && resolve(result)
        return
    }
    emits('action', { action, resolve, reject })
}

</script>
<template>
    <div class="form-field-struct" ref="self" :class="classNames">
        <label class="form-field-label"><span v-if="options.require" class="red">*</span>{{ options.label }}：</label>
        <div>
            <NodeRender isField :options="options.content" :state="state" @action="onAction" />
        </div>
    </div>
</template>
<style scoped lang="scss">
.form-field-struct {
    display: flex;
    width: 100%;
    height: 100%;
    padding: 12px;
    border: 1px solid transparent;
    border-radius: 4px;

    .form-field-label {
        line-height: 1;
        padding-top: 0.75em;
        text-align: right;
    }

    >div {
        flex: 1;
        overflow: hidden;
    }

    &.left {
        .form-field-label {
            width: auto;
        }
    }

    &.right {
        .form-field-label {
            width: 120px;
        }
    }

    &.error {
        background-color: var(--color-error-back);
        border-color: var(--color-error-border);
    }
}
</style>