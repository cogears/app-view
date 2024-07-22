<script setup lang="ts">
import { IScroller, ScrollEvent } from 'types';
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue';
withDefaults(defineProps<{
    scrollX?: boolean,
    border?: boolean,
}>(), {
    scrollX: false,
    border: false,
})
const temp = reactive({
    contentWidth: 0,
    contentHeight: 0,
})
const scrollbarX = ref<HTMLDivElement>()
const scrollbarY = ref<HTMLDivElement>()
const scrollBody = ref<HTMLDivElement>()
const scrollerContent = ref<HTMLDivElement>()
let scrollbar2Body = false

const resizeObserver = new ResizeObserver(entries => {
    temp.contentWidth = entries[0].contentRect.width
    temp.contentHeight = entries[0].contentRect.height
});

onMounted(() => {
    if (scrollerContent.value) {
        resizeObserver.observe(scrollerContent.value);
    }
})
onBeforeUnmount(() => {
    resizeObserver.disconnect()
})
defineExpose<IScroller>({
    scroll,
    scrollTo
})
const emits = defineEmits<{
    (e: 'scroll', data: ScrollEvent): void
}>()


function scroll(offX: number, offY: number) {
    if (scrollBody.value) {
        scrollTo(scrollBody.value.scrollLeft + offX, scrollBody.value.scrollTop + offY)
    }
}
function scrollTo(x: number, y: number, options?: { immediately?: boolean, position?: 'fixed' | 'absolute' }) {
    if (scrollBody.value) {
        options = Object.assign({ immediately: false, position: 'fixed' }, options)
        scrollbar2Body = false
        if (options.position == 'absolute') {
            let rect = scrollBody.value.getBoundingClientRect()
            x = x - rect.left + scrollBody.value.scrollLeft
            y = y - rect.top + scrollBody.value.scrollTop
        }
        scrollBody.value.scrollTo({
            left: x,
            top: y,
            behavior: options.immediately ? 'auto' : 'smooth'
        })
        emitSrollEvent()
    }
}

function emitSrollEvent() {
    if (scrollBody.value) {
        let width = scrollBody.value.scrollWidth - scrollBody.value.clientWidth
        if (width < 0) {
            width = 0
        }
        let height = scrollBody.value.scrollHeight - scrollBody.value.clientHeight
        if (height < 0) {
            height = 0
        }
        let x = scrollBody.value.scrollLeft
        let y = scrollBody.value.scrollTop
        let percentX = width > 0 ? x / width : 1
        let percentY = height > 0 ? y / height : 1
        emits('scroll', {
            x, y, percentX, percentY,
            width: scrollBody.value.clientWidth,
            height: scrollBody.value.clientHeight
        })
    }
}

function onBodyScroll() {
    if (!scrollbar2Body && scrollBody.value && scrollbarY.value && scrollbarX.value) {
        scrollbarX.value.scrollLeft = scrollBody.value.scrollLeft
        scrollbarY.value.scrollTop = scrollBody.value.scrollTop
        emitSrollEvent()
    }
}
function onScrollbarYScroll() {
    if (scrollbar2Body && scrollbarY.value && scrollBody.value) {
        scrollBody.value.scrollTop = scrollbarY.value.scrollTop
        emitSrollEvent()
    }
}
function onScrollbarXScroll() {
    if (scrollbar2Body && scrollbarX.value && scrollBody.value) {
        scrollBody.value.scrollLeft = scrollbarX.value.scrollLeft
        emitSrollEvent()
    }
}
function onMouseScrollbar() {
    scrollbar2Body = true
    document.onmouseup = function () {
        document.onmouseup = null
        scrollbar2Body = false
    }
}
</script>
<template>
    <div class="scroller border">
        <div class="scroller-container" ref="scrollBody" @scroll="onBodyScroll">
            <div ref="scrollerContent" :class="{ fit: scrollX }">
                <slot></slot>
            </div>
        </div>
        <div class="scrollbar-y" ref="scrollbarY" @scroll="onScrollbarYScroll" @mousedown="onMouseScrollbar"
            @wheel.prevent.passive>
            <div :style="{ height: temp.contentHeight + 'px' }"></div>
        </div>
        <div class="scrollbar-x" ref="scrollbarX" @scroll="onScrollbarXScroll" @mousedown="onMouseScrollbar"
            @wheel.prevent.passive>
            <div :style="{ width: temp.contentWidth + 'px' }"></div>
        </div>
    </div>
</template>
<style scoped lang="scss">
.scroller {
    position: relative;
    flex: 1;
    width: 100%;
    height: 100%;
    overflow: hidden;

    &.border {
        border-width: 1px;
    }

    .scroller-container {
        width: 100%;
        height: 100%;
        overflow: auto;

        .fit {
            width: fit-content;
        }

        &::-webkit-scrollbar {
            width: 0;
            height: 0;
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
                background-color: var(--color-scroller);
            }
        }

        .scrollbar-x {
            &::-webkit-scrollbar-thumb {
                background-color: var(--color-scroller);
            }
        }
    }
}
</style>