<script setup lang="ts">
import { computed, inject, reactive } from 'vue';
import ViewContext from '../ViewContext';
import ComboboxInput from './ComboboxInput.vue';
import { MenuOption } from './index';
import Input from './Input.vue';
const context = inject(ViewContext.NAME) as ViewContext
const props = withDefaults(defineProps<{
    options: MenuOption[],
    value?: any | any[],
    placeholder?: string,
    disabled?: boolean,
    readonly?: boolean,
    frameless?: boolean,
    multiple?: boolean,
    inputMode?: boolean,
    clearVisible?: boolean,
}>(), {
    placeholder: '请选择...',
    value: '',
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
    inputValue: ''
})
const emits = defineEmits<{
    (e: "update:value", value: string | string[]): void
    (e: 'change'): void
}>()

function onItemSelected(key: string | string[]) {
    emits('update:value', key)
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
    if (result) {
        onItemSelected(result)
    }
}

function onClear() {
    if (props.multiple) {
        onItemSelected([])
    } else {
        onItemSelected('')
    }
}
</script>
<template>
    <ComboboxInput :disabled="disabled" :readonly="readonly" :frameless="frameless" :placeholder="placeholder"
        :onDrop="onShowDropMenu">
        <template v-if="inputMode">
            <Input v-model:value="temp.inputValue" :placeholder="placeholder" frameless
                @change="onInputChanged"></Input>
        </template>
        <template v-else>
            <template v-if="selectedItems.length > 0">
                <div class="values">
                    <span class="text1 line1" v-if="multiple">{{ selectedItems.map(item => item.label).join(',')
                        }}</span>
                    <span class="text1 line1" v-else>{{ selectedItems[0].label }}</span>
                    <a class="icon i-guanbi" @click.stop="onClear" v-if="clearVisible"></a>
                </div>
            </template>
        </template>
    </ComboboxInput>
</template>
<style scoped lang="scss">
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