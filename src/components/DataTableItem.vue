<script setup lang="ts">
import { computed } from 'vue';
import { fetchValue } from '../common/dataUtil';
import * as filters from '../common/filters';
import { Column } from './index';
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
    if (props.column.format) {
        renderValue = filters.execute(props.column.format, renderValue, ...(props.column.formatArgs || []))
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