<script lang='ts' setup>
import formatter from '../common/formatter';
import { inject, reactive } from 'vue';
import ViewContext from '../ViewContext';
import ComboboxInput from './ComboboxInput.vue';
import IconCalendar from './icons/IconCalendar.vue'
const context = inject(ViewContext.NAME) as ViewContext
const props = withDefaults(defineProps<{
    value?: Date,
    format?: string,
    placeholder?: string,
    readonly?: boolean,
    disabled?: boolean,
    frameless?: boolean,
}>(), {
    placeholder: '请选择...',
    readonly: false,
    disabled: false,
    frameless: false,
})
const temp = reactive({
    focus: false,
})
const emits = defineEmits<{
    (e: 'update:value', dt: Date): void
    (e: 'change'): void
}>()

async function onShowCalendar(rect: DOMRect) {
    temp.focus = true;
    try {
        let target = await context.device.calendar(props.value, rect)
        if (target) {
            emits("update:value", target);
            emits("change");
        }
    } finally {
        temp.focus = false
    }
}

</script>
<template>
    <ComboboxInput :placeholder="placeholder" :disabled="disabled" :readonly="readonly" :frameless="frameless" :onDrop="onShowCalendar">
        <template v-if="value">
            {{ formatter.date(value.getTime(), format) }}
        </template>
        <template #suffix>
            <IconCalendar></IconCalendar>
        </template>
    </ComboboxInput>
</template>
<style lang='scss' scoped>
.combobox {
    width: 128px;
}
</style>