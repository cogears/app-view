<script setup lang="ts">
import { MenuOption } from 'types';
import { computed, inject, onMounted, reactive, ref } from 'vue';
import ViewContext, { Transaction } from '../ViewContext';
import Menu from '../components/Menu.vue';
import { CONTEXT_MENU } from './index';

const context = inject(ViewContext.NAME) as ViewContext
const temp = reactive({
    visible: false,
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    align: 'left',
    selected: [] as any[],
    multiple: false,
})
const data = ref<MenuOption<any>[]>([])
const style = computed(() => {
    let result: any = { top: temp.y + 'px', 'min-width': temp.width + 'px' }
    if (temp.align == 'left') {
        result.left = temp.x + 'px'
    } else {
        result.right = window.innerWidth - temp.x - temp.width + 'px'
    }
    if (temp.height > 0) {
        result.height = temp.height + 'px'
        result.overflow = 'auto'
    }
    return result
})
let dialogTransaction: Transaction<any>
onMounted(() => {
    context.device.addEventListener(CONTEXT_MENU, onShow)
})

function onShow(_: string, transaction: Transaction<any>, options: MenuOption<any>[], pos: { x: number, y: number, width: number, height: number, align: string, multiple: boolean }) {
    if (dialogTransaction) {
        dialogTransaction.abort()
    }
    if (options.length > 0) {
        dialogTransaction = transaction
        data.value = options
        temp.x = pos.x
        temp.y = pos.y
        temp.width = pos.width || 0
        temp.height = pos.height || 0
        temp.align = pos.align || 'left'
        temp.multiple = pos.multiple
        temp.visible = true
        temp.selected = []
        adjust()
        document.onmousedown = onClose
    } else {
        transaction.abort()
        document.onmousedown = null
        temp.visible = false
    }
}

function onSelected(items: MenuOption<any>[]) {
    if (temp.multiple) {
        let selected = items[items.length - 1].selected
        for (let item of items) {
            item.selected = !selected
        }
    } else {
        temp.selected = items.map(item => item.key)
        onClose()
    }
}

function onClose() {
    document.onmousedown = null
    temp.visible = false
    if (temp.multiple) {
        dialogTransaction.next(data.value.filter(item => item.selected).map(item => item.key))
    } else {
        dialogTransaction.next(temp.selected)
        temp.selected = []
    }
}

function adjust() {
    let height = data.value.length * 32
    if (height > window.innerHeight - 64) {
        temp.y = 32
        temp.height = window.innerHeight - 64
    } else if (temp.y + temp.height + height < window.innerHeight - 32) {
        temp.y = temp.y + temp.height
        temp.height = 0
    } else if (temp.y - height > 32) {
        temp.y = temp.y - height
        temp.height = 0
    } else {
        temp.y = 32
        temp.height = 0
    }
}
</script>
<template>
    <Transition>
        <div class="context-menu-layer" v-if="temp.visible">
            <Menu :options="data" :mode="temp.multiple ? 'checkbox' : undefined" :style="style" @mousedown.stop
                @selected="onSelected">
            </Menu>
        </div>
    </Transition>
</template>
<style scoped lang="scss">
.context-menu-layer {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 25;
}
</style>