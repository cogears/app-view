<script lang="ts">
export default {
    name: 'DataTableHead'
}
</script>
<script setup lang="ts">
import { Column, ColumnHeader } from 'types';
import { computed } from 'vue';

const props = defineProps<{
    head: ColumnHeader,
    columns: Column[],
    columnWidths: Record<string, number>,
    sort: boolean,
}>()
const column = computed(() => props.columns[props.head.from])
const thStyle = computed(() => {
    let width = 0
    for (let i = props.head.from; i <= props.head.to && i < props.columns.length; i++) {
        width += props.columnWidths[props.columns[i].key]
    }
    return {
        width: width + 'px',
    }
})

const tdStyle = computed(() => {
    return {
        textAlign: column.value.align || 'left'
    }
})

const thClass = computed(() => {
    let arr: string[] = []
    if (!props.head.children) {
        if (props.head.bgClass) {
            arr.push(props.head.bgClass + '-th')
        }
        arr.push('border')
    }
    return arr
})

const th0Class = computed(() => {
    if (props.head.bgClass && props.head.children) {
        return props.head.bgClass + '-th0'
    }
})

const emits = defineEmits<{
    (e: 'sort', c: Column): void,
}>()

function onSortByColumn(c: Column) {
    emits('sort', c)
}

</script>
<template>
    <div class="data-table-head" :class="thClass" :style="thStyle">
        <template v-if="head.children">
            <div class="label border" :class="th0Class">{{ head.label }}</div>
            <div class="head-children">
                <DataTableHead v-for="col in head.children" :head="col" :columns="columns" :columnWidths="columnWidths" :sort="sort" @sort="onSortByColumn">
                </DataTableHead>
            </div>
        </template>
        <template v-else-if="column">
            <a class="label" :style="tdStyle" v-if="sort && column.sort" @click="onSortByColumn(column)">
                <span class="space line1">
                    <slot :name="'th-' + column.key" :column="column" :item="{}">
                        {{ column.label }}
                    </slot>{{ column.sort == 'asc' ? '↑' : column.sort == 'desc' ? '↓' : '' }}
                </span>
            </a>
            <div class="label" :style="tdStyle" v-else>
                <span class="space line1">
                    <slot :name="'th-' + column.key" :column="column" :item="{}">
                        {{ column.label }}
                    </slot>
                </span>
            </div>
        </template>
    </div>
</template>
<style scoped lang="scss">
.data-table-head {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    .label {
        display: flex;
        align-items: center;
        width: 100%;
        height: 32px;
        line-height: 32px;
        padding: 0 8px;
        text-align: center;

        .setting {
            display: none;
            cursor: pointer;
            fill: var(--color-text3);

            &:hover {
                fill: var(--color-text1);
            }
        }

        &:hover {
            .setting {
                display: block;
            }
        }
    }

    .head-children {
        display: flex;
        flex: 1;
    }
}

.border {
    border-bottom-width: 1px;
    border-right-width: 1px;
}
</style>