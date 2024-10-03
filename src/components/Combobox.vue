<script setup lang="ts">
import { MenuOption } from 'types';
import { computed, inject, reactive, watch } from 'vue';
import ViewContext from '../ViewContext';
import ComboboxInput from './ComboboxInput.vue';
import IconClose from './icons/IconClose.vue';
const context = inject(ViewContext.NAME) as ViewContext
const props = withDefaults(defineProps<{
    options: MenuOption<any>[],
    value: any | any[],
    placeholder?: string,
    disabled?: boolean,
    readonly?: boolean,
    frameless?: boolean,
    multiple?: boolean,
    inputMode?: boolean,
    clearVisible?: boolean,
}>(), {
    placeholder: '请选择...',
    disabled: false,
    readonly: false,
    frameless: false,
    multiple: false,
    inputMode: false,
    clearVisible: false,
})
const selectedItems = computed(() => {
    if (props.value) {
        if (props.multiple) {
            return props.options.filter(item => props.value.indexOf(item.key) >= 0)
        } else {
            return props.options.filter(item => props.value == item.key)
        }
    } else {
        return []
    }
})
const temp = reactive({
    inputValue: '',
    focus: false,
})
const emits = defineEmits<{
    (e: "update:value", value: any | any[]): void
    (e: 'change'): void
}>()

watch(() => props.value, () => {
    if (selectedItems.value.length > 0) {
        if (props.multiple) {
            temp.inputValue = selectedItems.value.map(item => item.label).join(',')
        } else {
            temp.inputValue = selectedItems.value[0].label
        }
    } else {
        temp.inputValue = ''
    }
})

function onItemSelected(key: any[]) {
    if (props.multiple) {
        emits('update:value', key)
    } else {
        emits('update:value', key[0] || '')
    }
    emits('change')
}

async function onInputChanged() {
    if (lastPost) {
        onShowDropMenu(lastPost)
    }
}

let lastPost: DOMRect
async function onShowDropMenu(pos: DOMRect) {
    lastPost = pos
    let options = props.options
    if (props.inputMode) {
        let text = temp.inputValue.trim()
        if (text) {
            options = options.filter(item => item.label.indexOf(text) >= 0)
            options = options.slice(0, 10)
        } else {
            options = []
        }
    }
    if (options.length > 0 && props.multiple) {
        for (let item of options) {
            item.selected = props.value.indexOf(item.key) >= 0
        }
    }
    let result = await context.device.contextMenu(options, {
        x: pos.left, y: pos.top, width: pos.width, height: pos.height,
        align: 'right', multiple: props.multiple
    })
    if (result && result.length > 0) {
        onItemSelected(result)
    }
}

function onClear() {
    onItemSelected([])
}
</script>
<template>
    <ComboboxInput :focus="temp.focus" :disabled="disabled" :readonly="readonly" :frameless="frameless" :placeholder="placeholder" :onDrop="onShowDropMenu">
        <template v-if="inputMode">
            <input class="input" v-model="temp.inputValue" :placeholder="placeholder" @focus="temp.focus = true" @blur="temp.focus = false" @input="onInputChanged">
        </template>
        <template v-else>
            <template v-if="selectedItems.length > 0">
                <div class="values">
                    <span class="text1 line1" v-if="multiple">{{ selectedItems.map(item => item.label).join(',')
                        }}</span>
                    <span class="text1 line1" v-else>{{ selectedItems[0].label }}</span>
                </div>
            </template>
        </template>
        <template #suffix>
            <IconClose @click.stop="onClear" v-if="clearVisible && selectedItems.length > 0"></IconClose>
        </template>
    </ComboboxInput>
</template>
<style scoped lang="scss">
.input {
    width: 100%;
    height: 2.5em;
    background-color: transparent;
    border: 0;
}

.values {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-right: 4px;

    span {
        flex: 1;
    }
}
</style>