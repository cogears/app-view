<script setup lang="ts">
import { fetchValue } from '@/common';
import Calendar from '@/components/Calendar.vue';
import ViewContext from '@/ViewContext';
import { ActionEvent, AppContext, AppContextType, DateRangeOptions, DateRangeState } from 'types';
import { computed, inject } from 'vue';
import { ACTION_VALIDATE_INPUT } from '../protocols';

const context = inject(ViewContext.NAME as AppContextType) as AppContext
const props = defineProps<{
    options: DateRangeOptions,
    state: any,
}>()

const disabled = computed(() => props.options.disabled ? fetchValue(props.state, props.options.disabled) : false)
const rangeState = computed<DateRangeState>(() => {
    let value = fetchValue(props.state, props.options.name)
    if (value == undefined || value == null) {
        throw new Error('数据未定义：' + props.options.name)
    }
    return value
})

const from = computed({
    get() {
        return rangeState.value.from
    },
    set(value) {
        rangeState.value.from = value
    }
})

const to = computed({
    get() {
        return rangeState.value.to
    },
    set(value) {
        rangeState.value.to = value
    }
})

const emits = defineEmits<{
    (e: 'action', event: ActionEvent): void
}>()

function onFromChanged(value: Date) {
    if (to.value) {
        let days = Math.floor(to.value.getTime() / 86400000) - Math.floor(value.getTime() / 86400000)
        if (days <= 0) {
            return context.device.toast('开始时间不可晚于结束时间')
        }
    }
    from.value = value
    if (to.value) {
        onChanged()
    }
}
function onToChanged(value: Date) {
    if (from.value) {
        let days = Math.floor(value.getTime() / 86400000) - Math.floor(from.value.getTime() / 86400000)
        if (days <= 0) {
            return context.device.toast('结束时间不可早于开始时间')
        }
    }
    to.value = value
    if (from.value) {
        onChanged()
    }
}

async function onChanged() {
    emits('action', { action: { name: ACTION_VALIDATE_INPUT, data: [] } })

    if (props.options.onChanged) {
        for (let action of props.options.onChanged) {
            await new Promise((resolve, reject) => {
                emits('action', { action, resolve, reject })
            })
        }
    }
}
</script>
<template>
    <Calendar :value="from" :disabled="disabled" @update:value="onFromChanged"></Calendar>
    <span style="margin:0 4px">至</span>
    <Calendar :value="to" :disabled="disabled" @update:value="onToChanged"></Calendar>
</template>
<style scoped lang="scss">
.combobox {
    width: 128px;
    height: 36px;
}
</style>