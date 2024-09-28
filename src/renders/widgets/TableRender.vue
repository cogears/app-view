<script lang="ts">
import ViewContext from '@/ViewContext';
import { fetchValue } from '@/common';
import Checkbox from '@/components/Checkbox.vue';
import DataTable from '@/components/DataTable.vue';
import { ActionEvent, Column, TableOptions, TableState } from 'types';
import type { PropType } from 'vue';
import { computed, defineComponent, h, inject, onBeforeUnmount, reactive } from 'vue';
import { ACTION_DELETE_TABLE_ROW } from '../protocols';
import { executeCompare, isNull, textWidth } from '../utils';
import ContainerRender from './ContainerRender.vue';

export default defineComponent({
    props: {
        options: {
            type: Object as PropType<TableOptions>,
            required: true,
        },
        state: {
            type: Object as PropType<any>,
            required: true
        },
    },
    setup(props, ctx) {
        const context = inject(ViewContext.NAME) as ViewContext
        const temp = reactive({
            selectAll: false
        })
        const columns = computed(() => {
            let arr: Column[] = props.options.fields.map(field => ({
                key: field.key,
                label: field.label,
                width: field.width || textWidth(field.label),
                widthFixed: !!field.width,
                format: field.format,
                render: field.render,
                classNames: field.classNames,
                fixed: field.fixed,
                suffix: field.suffix,
                sort: field.sort,
                orderBy: field.orderBy,
                align: field.align,
            }))
            if (props.options.select) {
                arr.unshift({
                    key: '__select',
                    label: '选择',
                    fixed: true,
                    width: 50,
                    widthFixed: true,
                    align: 'center',
                })
            }
            return arr
        })
        const tableState = computed<TableState>(() => {
            let value = fetchValue(props.state, props.options.name)
            if (value == undefined || value == null) {
                throw new Error('表格数据未定义：' + props.options.name)
            }
            return value
        })
        const source = computed(() => fetchValue(tableState.value, 'source') || [])
        const tableData = computed(() => {
            let result: any[] = source.value
            if (props.options.filters && props.options.filters.length > 0) {
                const filters = props.options.filters.filter(filter => !isNull(fetchValue(props.state, filter.target)))
                if (filters.length > 0) {
                    filters.sort(f0 => {
                        return f0.reductRule == 'or' ? -1 : 1
                    })
                    result = result.filter(item => {
                        let selected = false
                        for (let i = 0; i < filters.length; i++) {
                            const source = fetchValue(item, filters[i].source)
                            const target = fetchValue(props.state, filters[i].target)
                            const hit = executeCompare(source, target, filters[i].mapRule || '=')
                            if (i == 0) {
                                selected = hit
                            } else {
                                selected = filters[i].reductRule == 'or' ? (selected || hit) : (selected && hit)
                            }
                        }
                        return selected
                    })
                }
            }
            return result
        })
        const selected = computed({
            get() {
                return tableState.value.selected
            },
            set(value: any) {
                tableState.value.selected = value
            }
        })
        const loading = computed(() => tableState.value.loading)

        onBeforeUnmount(() => {
            selected.value = []
        })

        async function onSelected(item: any) {
            if (selected.value) {
                let i = selected.value.indexOf(item.id)
                if (i == -1) {
                    let limit = props.options.selectLimit || 999
                    if (limit == 1) {
                        selected.value.length = 0
                        selected.value.push(item.id)
                    } else if (selected.value.length < limit) {
                        selected.value.push(item.id)
                    } else {
                        context.device.toast('最多选择' + limit + '项')
                    }
                } else {
                    selected.value.splice(i, 1)
                }
            }
            if (props.options.onSelected) {
                for (let action of props.options.onSelected) {
                    let data = [item, ...action.data]
                    await new Promise((resolve, reject) => {
                        ctx.emit('action', { action: { name: action.name, data }, resolve, reject })
                    })
                }
            }
        }
        function onSelectAll() {
            temp.selectAll = !temp.selectAll
            selected.value.splice(0, selected.value.length)
            if (temp.selectAll) {
                let limit = props.options.selectLimit || 999
                for (let i = 0; i < limit && i < tableData.value.length; i++) {
                    selected.value.push(tableData.value[i].id)
                }
            }
        }
        function onAction({ action, resolve, reject }: ActionEvent, item: any) {
            if (action.name == ACTION_DELETE_TABLE_ROW) {
                let i = source.value.indexOf(item)
                source.value.splice(i, 1)
                resolve && resolve()
                return
            }
            action = {
                name: action.name,
                data: [item, ...action.data]
            }
            ctx.emit('action', { action, resolve, reject })
        }

        async function onSort(c: Column) {
            if (props.options.onSort) {
                for (let action of props.options.onSort) {
                    let data = [c, ...action.data]
                    await new Promise((resolve, reject) => {
                        ctx.emit('action', { action: { name: action.name, data }, resolve, reject })
                    })
                }
            }
        }

        const slots: any = {
            'td-__select': ({ item }: any) => h(Checkbox, { value: item.id, selected: selected.value, readonly: true, style: { 'align-items': 'center', height: '100%' } })
        }
        if (props.options.selectLimit && props.options.selectLimit > 10) {
            slots['th-__select'] = ({ }) => h(Checkbox, { selected: temp.selectAll, onChange: onSelectAll, style: { 'align-items': 'center', height: '100%' } })
        }
        for (let field of props.options.fields) {
            if (field.contents) {
                slots['td-' + field.key] = ({ item }: any) => h(ContainerRender, {
                    options: { children: field.contents || [] },
                    state: item,
                    onAction: (event: ActionEvent) => onAction(event, item),
                })
            }
        }
        return () => {
            return h(DataTable, {
                columns: columns.value,
                data: tableData.value,
                loading: loading.value,
                sort: true,
                serial: props.options.serial,
                selectable: true,
                onSelected: onSelected,
                onSort: onSort,
            }, slots)
        }
    },
})
</script>