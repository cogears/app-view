<script setup lang="ts">
import { Column, ColumnHeader, } from 'types';
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';
import { packTask } from '../common/taskUtil';
import DataTableHead from './DataTableHead.vue';
import DataTableItem from './DataTableItem.vue';
import Loading from './Loading.vue';
import { sort as sort0 } from './options';
const head = ref<HTMLDivElement>()
const scrollbarX = ref<HTMLDivElement>()
const scrollbarY = ref<HTMLDivElement>()
const body = ref<HTMLDivElement>()
const scrollBody = ref<HTMLDivElement>()
const props = withDefaults(defineProps<{
    data: any[],
    columns: Column[],
    headers?: ColumnHeader[],
    border?: boolean,
    full?: boolean,
    big?: boolean,
    serial?: boolean,
    loading?: boolean,
    selectable?: boolean,
    defaultSelectedIndex?: number,
    drag?: boolean,
    sort?: boolean,
    sortHandler?: (list: any[], c: Column) => void,
}>(), {
    border: true,
    full: true,
    big: false,
    serial: false,
    selectable: true,
    drag: false,
    defaultSelectedIndex: -1,
    sort: false
})

const temp = reactive({
    pageSize: 0,
    pageOffsetIndex: 0,
    pageOffsetTop: 0,
    hoverIndex: -1,
    selectedIndices: [] as number[],
    dataSource: [] as any[],
    dataSourceRefresh: false,

    dragIndex: -1,
    draging: false,
    dragOffsetX: 0,
    dragOffsetY: 0,
    dragX: 0,
    dragY: 0,

    clientWidth: 0,
    clientHeight: 0,
    contentWidth: 0,
    contentHeight: 0,
    scrollLeft: 0,
    scrollTop: 0,
})

const columnWidths = ref<any>({})
const fixedColumns = computed(() => props.columns.filter(c => c.fixed))
const scrollColumns = computed(() => props.columns.filter(c => !c.fixed && !c.suffix))
const suffixedColumns = computed(() => props.columns.filter(c => c.suffix))

const fixedHeaders = computed<ColumnHeader[]>(() => {
    const offset = fixedColumns.value.length
    if (props.headers) {
        return props.headers.filter(col => col.to < offset)
    } else {
        return fixedColumns.value.map((c, i) => ({
            label: '', from: i, to: i, bgClass: c.bgClass,
        }))
    }
})

const scrollHeaders = computed(() => {
    const offset = fixedColumns.value.length
    const offset2 = scrollColumns.value.length
    if (props.headers) {
        return props.headers.filter(col => col.to >= offset && col.to < offset + offset2)
    } else {
        return scrollColumns.value.map((c, i) => ({
            label: '', from: i + offset, to: i + offset, bgClass: c.bgClass,
        }))
    }
})

const suffixedHeaders = computed(() => {
    const offset = fixedColumns.value.length + scrollColumns.value.length
    if (props.headers) {
        return props.headers.filter(col => col.to >= offset && col.to < props.columns.length)
    } else {
        return suffixedColumns.value.map((c, i) => ({
            label: '', from: i + offset, to: i + offset, bgClass: c.bgClass,
        }))
    }
})

const bodyStyle = computed(() => {
    if (props.big && temp.pageOffsetTop) {
        return { transform: 'translate(0,' + temp.pageOffsetTop + 'px)' }
    }
})
const fixShadowX = computed(() => temp.contentWidth > temp.clientWidth && temp.scrollLeft > 0)
const suffixShadowX = computed(() => temp.contentWidth > temp.clientWidth && temp.scrollLeft < temp.contentWidth - temp.clientWidth)
const dragItem = computed(() => props.data[temp.dragIndex])
const dragStyle = computed(() => ({ left: temp.dragX + 'px', top: temp.dragY + 'px' }))
const resizeObserver = new ResizeObserver(onTableResize);

const emits = defineEmits<{
    (e: 'resize', data: { width: number, height: number, pageSize: number }): void
    (e: 'scroll', data: { y: number, height: number, percent: number }): void
    (e: 'load', data: any[]): void
    (e: 'sort', c: Column): void
    (e: 'selected', item: any): void
    (e: 'execute', item: any): void
    (e: 'contextmenu', data: { evt: MouseEvent, item: any, index: number }): void
    (e: 'drag', data: { source: number, target: number }): void
}>()

defineExpose({
    clearSelected() {
        temp.selectedIndices = []
    }
})
watch(() => props.data, () => {
    reset()
})
watch(() => props.columns, () => {
    reset()
})
onMounted(() => {
    if (body.value) {
        resizeObserver.observe(body.value);
    }
    reset()
})

onBeforeUnmount(() => {
    resizeObserver.disconnect()
})

function onTableResize() {
    if (body.value) {
        temp.clientWidth = body.value.clientWidth
        temp.clientHeight = body.value.clientHeight
        temp.pageSize = Math.ceil(temp.clientHeight / ROW_HEIGHT) + 1
        temp.dataSourceRefresh = true
        computeColumnWidth()
        if (temp.clientWidth < temp.contentWidth) {
            let scrollMax = temp.contentWidth - temp.clientWidth
            if (temp.scrollLeft > scrollMax) {
                temp.scrollLeft = scrollMax
            }
        } else {
            temp.scrollLeft = 0
        }
        deployScrollPosition()
        onEmitScroll()
        emits('resize', { width: temp.clientWidth, height: temp.clientHeight, pageSize: temp.pageSize })
    }
}

const SERIAL_WIDTH = 60
const ROW_HEIGHT = 64
function reset() {
    for (let i = 0; i < props.data.length; i++) {
        if (props.data[i].__no) {
            continue
        }
        props.data[i].__no = i + 1
    }
    let contentWidth = props.serial ? SERIAL_WIDTH : 0
    for (let item of props.columns) {
        contentWidth += item.width
    }
    temp.contentWidth = contentWidth
    temp.contentHeight = props.data.length * ROW_HEIGHT
    temp.scrollTop = 0
    temp.dataSourceRefresh = true

    computeColumnWidth()
    deployScrollPosition()
    onEmitScroll()
    checkDefaultSelected()
}

function deployDataSource(pageOffsetIndex: number, pageOffsetTop: number) {
    if (props.big) {
        temp.pageOffsetTop = pageOffsetTop
        if (temp.dataSourceRefresh || temp.pageOffsetIndex != pageOffsetIndex) {
            temp.dataSourceRefresh = false
            temp.pageOffsetIndex = pageOffsetIndex
            temp.dataSource = props.data.slice(temp.pageOffsetIndex, temp.pageOffsetIndex + temp.pageSize)
            emits('load', temp.dataSource)
        }
    } else {
        if (temp.dataSourceRefresh) {
            temp.dataSourceRefresh = false
            temp.dataSource = props.data
            emits('load', temp.dataSource)
        }
    }
}

function checkDefaultSelected() {
    if (props.data[props.defaultSelectedIndex]) {
        onClick(props.defaultSelectedIndex)
    } else {
        temp.selectedIndices = []
    }
}

function computeColumnWidth() {
    let totalWidth = temp.clientWidth
    if (props.serial) {
        totalWidth -= SERIAL_WIDTH
    }
    let result: any = {}
    let widthFixedColumns = props.columns.filter(item => item.widthFixed)
    for (let item of widthFixedColumns) {
        result[item.key] = item.width
        totalWidth -= item.width
    }
    let columns = props.columns.filter(item => !item.widthFixed)
    columns.sort((i0, i1) => i1.width - i0.width)
    let averageWidth = totalWidth / columns.length
    for (let i = 0; i < columns.length; i++) {
        let item = columns[i]
        let w = item.width
        if (w > averageWidth) {
            result[item.key] = w
            totalWidth -= w
            averageWidth = totalWidth / (columns.length - i - 1)
        } else {
            result[item.key] = averageWidth
        }
    }
    columnWidths.value = result
}

function columnClass(i: number) {
    if (temp.selectedIndices.indexOf(i) >= 0) {
        return 'on'
    } else if (temp.hoverIndex == i) {
        return 'hover'
    }
}
function tdStyle(c: Column): any {
    return {
        width: columnWidths.value[c.key] + 'px',
        textAlign: c.align || 'left'
    }
}
function tdClass(c: Column): any {
    if (c.bgClass) {
        return c.bgClass + '-td'
    }
}
/////////////////////////// mouse event handlers ///////////////////////////
function onMouseOver(i: number) {
    if (props.selectable) {
        temp.hoverIndex = i
    }
}
function onMouseOut(_i: number) {
    if (props.selectable) {
        temp.hoverIndex = -1
    }
}

function onMouseDown(e: MouseEvent, i: number) {
    if (props.drag && props.selectable && body.value) {
        temp.dragIndex = i;
        temp.draging = false
        let { top, left, right } = body.value.getBoundingClientRect()
        temp.dragOffsetX = e.clientX - left
        temp.dragOffsetY = e.offsetY
        document.onmousemove = (e) => {
            temp.draging = true
            temp.dragX = e.clientX - temp.dragOffsetX
            temp.dragY = e.clientY - temp.dragOffsetY
        };
        document.onmouseup = (e) => {
            document.onmousemove = null;
            document.onmouseup = null;
            if (temp.draging) {
                let target = temp.hoverIndex;
                if (target == -1) {
                    if (e.clientX > left && e.clientX < right) {
                        if (e.clientY < top) {
                            target = 0
                        } else if (e.clientY > props.data.length * ROW_HEIGHT) {
                            target = props.data.length
                        }
                    }
                }
                if (target >= 0 && target != i) {
                    let [item] = props.data.splice(temp.dragIndex, 1)
                    if (temp.dragIndex < target) {
                        target--
                    }
                    props.data.splice(target, 0, item)
                    emits('drag', { source: temp.dragIndex, target })
                }
            }
            temp.draging = false
            temp.dragIndex = -1
        };
    }
}

function onClick(i: number, e?: MouseEvent) {
    if (props.selectable) {
        if (e) {
            if (e.shiftKey && temp.selectedIndices.length > 0) {
                let from = temp.selectedIndices[0]
                let to = i
                let step = from < to ? 1 : -1
                temp.selectedIndices = [from]
                while (from != to) {
                    from += step
                    temp.selectedIndices.push(from)
                }
                return
            } else if (e.ctrlKey || e.altKey) {
                temp.selectedIndices.push(i)
                return
            }
        }
        temp.selectedIndices = [i]
        emits('selected', props.data[temp.selectedIndices[0]])
    }
}

function onExecute0() {
    if (props.selectable) {
        emits('execute', props.data[temp.selectedIndices[0]])
    }
}

function onContextMenu0(i: number, e: MouseEvent) {
    if (props.selectable) {
        e.preventDefault()
        temp.selectedIndices = [i]
        emits('contextmenu', { evt: e, item: props.data[i], index: i })
    }
}

function onSortByColumn(c: Column) {
    for (let item of props.columns) {
        if (item == c) {
            if (item.sort == 'desc') {
                item.sort = 'asc'
            } else {
                item.sort = 'desc'
            }
        } else if (item.sort) {
            item.sort = 'none'
        }
    }
    if (temp.selectedIndices.length > 1) {
        let topData = props.data.filter((_item, i) => temp.selectedIndices.indexOf(i) >= 0)
        let bottomData = props.data.filter((_item, i) => temp.selectedIndices.indexOf(i) == -1)
        if (props.sortHandler) {
            props.sortHandler(topData, c)
        } else {
            sort0(topData, c)
        }
        props.data.splice(0, props.data.length, ...topData, ...bottomData)
        temp.selectedIndices = []
        for (let i = 0; i < topData.length; i++) {
            temp.selectedIndices.push(i)
        }
    } else {
        if (c.orderBy) {
            emits('sort', c)
            return
        } else {
            let selected__no = (temp.selectedIndices.length > 0 && temp.selectedIndices[0] >= 0) ? props.data[temp.selectedIndices[0]].__no : 0
            if (props.sortHandler) {
                props.sortHandler(props.data, c)
            } else {
                sort0(props.data, c)
            }
            if (selected__no > 0) {
                temp.selectedIndices[0] = props.data.findIndex(item => item.__no == selected__no)
            }
        }
    }
    temp.scrollTop = 0
    temp.dataSourceRefresh = true
    deployScrollPosition()
    onEmitScroll()
}

/////////////////////////// scroll handlers ///////////////////////////
const onEmitScroll = packTask(() => {
    let pageOffsetIndex = Math.floor(temp.scrollTop / ROW_HEIGHT)
    let pageOffsetTop = -(temp.scrollTop % ROW_HEIGHT)

    let percent = 1
    if (temp.contentHeight > temp.clientHeight) {
        percent = temp.scrollTop / (temp.contentHeight - temp.clientHeight)
    }
    deployDataSource(pageOffsetIndex, pageOffsetTop)
    emits('scroll', { y: temp.scrollTop, height: temp.clientHeight, percent })
}, 16)

function deployScrollPosition() {
    if (scrollbarY.value && body.value) {
        scrollbarY.value.scrollTop = body.value.scrollTop = 0
    }
    setTimeout(() => {
        if (scrollbarX.value && scrollBody.value && head.value) {
            head.value.scrollLeft = scrollBody.value.scrollLeft = scrollbarX.value.scrollLeft = temp.scrollLeft
        }
    }, 0);
}

let scrollbar2Body = false
function onBodyWheel(e: WheelEvent) {
    if (!scrollbar2Body && props.big) {
        if (scrollbarY.value) {
            let scrollTop = scrollbarY.value.scrollTop + e.deltaY
            let scrollTopMax = scrollbarY.value.scrollHeight - scrollbarY.value.clientHeight
            if (scrollTop < 0) {
                scrollTop = 0
            } else if (scrollTop > scrollTopMax) {
                scrollTop = scrollTopMax
            }
            temp.scrollTop = scrollbarY.value.scrollTop = scrollTop
        }

        if (scrollbarX.value) {
            let scrollLeft = scrollbarX.value.scrollLeft + e.deltaX
            let scrollLeftMax = scrollbarX.value.scrollWidth - scrollbarX.value.clientWidth
            if (scrollLeft < 0) {
                scrollLeft = 0
            } else if (scrollLeft > scrollLeftMax) {
                scrollLeft = scrollLeftMax
            }
            temp.scrollLeft = scrollbarX.value.scrollLeft = scrollLeft
        }

        onEmitScroll()
    }
}
function onBodyScroll() {
    if (!scrollbar2Body && !props.big) {
        if (body.value && scrollbarY.value) {
            temp.scrollTop = scrollbarY.value.scrollTop = body.value.scrollTop
        }
        if (scrollBody.value && scrollbarX.value) {
            temp.scrollLeft = scrollbarX.value.scrollLeft = scrollBody.value.scrollLeft
        }
        onEmitScroll()
    }
}
function onScrollbarYScroll() {
    if (scrollbarY.value && body.value) {
        if (props.big) {
        } else {
            body.value.scrollTop = scrollbarY.value.scrollTop
        }
        temp.scrollTop = scrollbarY.value.scrollTop
        onEmitScroll()
    }
}
function onScrollbarXScroll() {
    if (scrollbarX.value && scrollBody.value && head.value) {
        temp.scrollLeft = head.value.scrollLeft = scrollBody.value.scrollLeft = scrollbarX.value.scrollLeft
    }
}
function onMouseDownScrollbar() {
    scrollbar2Body = true
    document.onmouseup = function () {
        document.onmouseup = null
        scrollbar2Body = false
    }
}
</script>
<template>
    <div class="data-table" :class="{ full: full, border: border }">
        <div class="thead frame text2">
            <div class="fixed" :class="{ shadowX: fixShadowX }">
                <div class="columns headers">
                    <span class="td-serial" v-if="serial">序号</span>
                    <DataTableHead v-for="head in fixedHeaders" :head="head" :columns="columns" :columnWidths="columnWidths" :sort="sort" @sort="onSortByColumn">
                        <template v-for="(_item, key, index) in $slots" :key="index" v-slot:[key]="data">
                            <slot :name="key" v-bind="data"></slot>
                        </template>
                    </DataTableHead>
                </div>
            </div>
            <div class="scroller" ref="head">
                <div class="columns headers">
                    <DataTableHead v-for="head in scrollHeaders" :head="head" :columns="columns" :columnWidths="columnWidths" :sort="sort" @sort="onSortByColumn">
                        <template v-for="(_item, key, index) in $slots" :key="index" v-slot:[key]="data">
                            <slot :name="key" v-bind="data"></slot>
                        </template>
                    </DataTableHead>
                </div>
            </div>
            <div class="suffixed" :class="{ shadowX2: suffixShadowX }" v-if="suffixedHeaders.length">
                <div class="columns headers">
                    <DataTableHead v-for="head in suffixedHeaders" :head="head" :columns="columns" :columnWidths="columnWidths" :sort="sort" @sort="onSortByColumn">
                        <template v-for="(_item, key, index) in $slots" :key="index" v-slot:[key]="data">
                            <slot :name="key" v-bind="data"></slot>
                        </template>
                    </DataTableHead>
                </div>
            </div>
        </div>
        <div class="tbody">
            <div class="tbody-scroller" :class="{ lock: big }" ref="body" @scroll.stop="onBodyScroll" @wheel.passive="onBodyWheel">
                <div class="tbody-content" :style="bodyStyle">
                    <div class="fixed" :class="{ shadowX: fixShadowX }">
                        <div class="columns" v-for="(item, i) in temp.dataSource" :class="columnClass(i + temp.pageOffsetIndex)" @mouseover="onMouseOver(i + temp.pageOffsetIndex)" @mouseout="onMouseOut(i + temp.pageOffsetIndex)" @mousedown="onMouseDown($event, i + temp.pageOffsetIndex)" @click="onClick(i + temp.pageOffsetIndex, $event)" @dblclick="onExecute0" @contextmenu="onContextMenu0(i + temp.pageOffsetIndex, $event)">
                            <span class="td-serial" v-if="serial">{{ i + temp.pageOffsetIndex + 1 }}</span>
                            <DataTableItem v-for="c in fixedColumns" :class="tdClass(c)" :style="tdStyle(c)" :item="item" :column="c">
                                <slot :name="'td-' + c.key" :item="item" :column="c" :index="i + temp.pageOffsetIndex">
                                </slot>
                            </DataTableItem>
                        </div>
                    </div>
                    <div class="scroller" ref="scrollBody" @scroll.stop="onBodyScroll">
                        <div class="columns" v-for="(item, i) in temp.dataSource" :class="columnClass(i + temp.pageOffsetIndex)" @mouseover="onMouseOver(i + temp.pageOffsetIndex)" @mouseout="onMouseOut(i + temp.pageOffsetIndex)" @mousedown="onMouseDown($event, i + temp.pageOffsetIndex)" @click="onClick(i + temp.pageOffsetIndex, $event)" @dblclick="onExecute0" @contextmenu="onContextMenu0(i + temp.pageOffsetIndex, $event)">
                            <DataTableItem v-for="c in scrollColumns" :class="tdClass(c)" :style="tdStyle(c)" :item="item" :column="c">
                                <slot :name="'td-' + c.key" :item="item" :column="c" :index="i + temp.pageOffsetIndex">
                                </slot>
                            </DataTableItem>
                        </div>
                        <div class="fill-blank" :style="{ width: temp.contentWidth + 'px' }" v-if="temp.dataSource.length == 0"></div>
                    </div>
                    <div class="suffixed" :class="{ shadowX2: suffixShadowX }" v-if="suffixedColumns.length">
                        <div class="columns" v-for="(item, i) in temp.dataSource" :class="columnClass(i + temp.pageOffsetIndex)" @mouseover="onMouseOver(i + temp.pageOffsetIndex)" @mouseout="onMouseOut(i + temp.pageOffsetIndex)" @mousedown="onMouseDown($event, i + temp.pageOffsetIndex)" @click="onClick(i + temp.pageOffsetIndex, $event)" @dblclick="onExecute0" @contextmenu="onContextMenu0(i + temp.pageOffsetIndex, $event)">
                            <DataTableItem v-for="c in suffixedColumns" :class="tdClass(c)" :style="tdStyle(c)" :item="item" :column="c">
                                <slot :name="'td-' + c.key" :item="item" :column="c" :index="i + temp.pageOffsetIndex">
                                </slot>
                            </DataTableItem>
                        </div>
                    </div>
                </div>
            </div>
            <div class="empty" v-if="data.length == 0 && !loading">
                <slot name="empty">
                    <div>暂无数据</div>
                </slot>
            </div>
            <div class="scrollbar-y" ref="scrollbarY" @scroll.stop="onScrollbarYScroll" @mousedown="onMouseDownScrollbar" @wheel.passive="onScrollbarYScroll" v-if="full">
                <div :style="{ height: temp.contentHeight + 'px' }"></div>
            </div>
            <div class="scrollbar-x" ref="scrollbarX" @scroll.stop="onScrollbarXScroll" @mousedown="onMouseDownScrollbar" @wheel.passive="onScrollbarXScroll">
                <div :style="{ width: temp.contentWidth + 'px' }"></div>
            </div>
        </div>
        <div class="dragItem columns bubble" :style="dragStyle" v-if="temp.draging">
            <span class="td-serial" v-if="serial">{{ temp.dragIndex }}</span>
            <DataTableItem v-for="c in columns" :class="tdClass(c)" :style="tdStyle(c)" :item="dragItem" :column="c">
                <slot :name="'td-' + c.key" :item="dragItem" :column="c"></slot>
            </DataTableItem>
        </div>
        <Loading :visible="loading"></Loading>
    </div>
</template>
<style scoped lang="scss">
.data-table {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    min-height: 100px;

    &.full {
        flex: 1;
        height: 100%;
        overflow: hidden;
    }

    &.border {
        border-width: 1px;
    }

    .fixed {
        position: relative;
    }

    .suffixed {
        position: relative;
    }

    .scroller {
        flex: 1;
        overflow: hidden;
    }
}

.columns {
    display: flex;
    width: fit-content;

    span {
        border-right: 1px solid var(--color-border);
        border-bottom: 1px solid var(--color-border);
    }

    &.headers {
        height: 100%;
    }
}

.thead {
    display: flex;
}

.tbody {
    position: relative;
    flex: 1;
    overflow: hidden;

    .tbody-scroller {
        height: 100%;
        overflow: auto;

        &.lock {
            overflow: hidden;
        }

        &::-webkit-scrollbar {
            width: 0;
            height: 0;
        }

        .tbody-content {
            display: flex;

            .fill-blank {
                height: 1px;
            }
        }

        .scroller {
            overflow: auto;

            &::-webkit-scrollbar {
                width: 0;
                height: 0;
            }
        }
    }

    .columns {
        span {
            height: 64px;
            line-height: 64px;
            padding: 0 8px;
        }

        &.on {
            background-color: var(--color-selected);
        }

        &.hover {
            background-color: var(--color-hover);
        }
    }

    .scrollbar-y {
        position: absolute;
        top: 0;
        bottom: 0;
        right: 0;
        overflow-x: hidden;
        overflow-y: auto;

        >div {
            width: 1px;
        }
    }

    .scrollbar-x {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        overflow-x: auto;
        overflow-y: hidden;

        >div {
            height: 1px;
        }
    }

    &:hover {
        .scrollbar-y {
            &::-webkit-scrollbar-thumb {
                background-color: var(--color-scroller)
            }
        }

        .scrollbar-x {
            &::-webkit-scrollbar-thumb {
                background-color: var(--color-scroller)
            }
        }
    }
}

.td-serial {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 60px;
    text-align: center;
}

.dragItem {
    position: fixed;
    opacity: 0.8;
    pointer-events: none;

    span {
        height: 32px;
        line-height: 32px;
        padding: 0 8px;
    }
}

.shadowX {
    &::after {
        content: '';
        pointer-events: none;
        position: absolute;
        display: block;
        left: 100%;
        top: 0;
        width: 10px;
        height: 100%;
        background: linear-gradient(90deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0) 100%);
    }
}

.shadowX2 {
    &::after {
        content: '';
        pointer-events: none;
        position: absolute;
        display: block;
        right: 100%;
        top: 0;
        width: 10px;
        height: 100%;
        background: linear-gradient(-90deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0) 100%);
        border-right: 1px solid var(--color-border);
    }
}

.empty {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}
</style>