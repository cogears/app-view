<script setup lang="ts">
import { Column } from 'types';
import { computed } from 'vue';
import formatter from '../common/formatter';
import { fetchValue } from '@/common/dataUtil'
const props = defineProps<{
    item: any,
    column: Column
}>()
const value = computed(() => {
    return fetchValue(props.item, props.column.key)
})
const render = computed(() => {
    let renderValue = value.value
    if (props.column.render) {
        renderValue = props.column.render(renderValue, props.column, props.item)
    }
    //@ts-ignore
    if (props.column.format && formatter[props.column.format]) {
        //@ts-ignore
        renderValue = formatter[props.column.format](renderValue, ...(props.column.formatArgs || []))
    }
    return renderValue
})
const classNames = computed(() => {
    let names: string[] = []
    if (props.column.classNames) {
        if (typeof props.column.classNames == 'string') {
            names.push(props.column.classNames)
        } else {
            names.push(...props.column.classNames(value.value, props.column, props.item))
        }
    }
    if (props.column.bold) {
        names.push('bold')
    }
    return names
})

</script>
<template>
    <span :class="classNames">
        <slot>
            <div class="line1" :title="render">
                {{ render }}
            </div>
        </slot>
    </span>
</template>
<style scoped lang="scss">
.bold {
    font-weight: bold;
}
</style>