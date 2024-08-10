<script setup lang="ts">
import { computed, inject, onBeforeUnmount, onMounted, reactive, watch } from 'vue';
import ViewContext from '../ViewContext';
import Loading from './Loading.vue';
import IconClose from './icons/IconClose.vue';

const context = inject(ViewContext.NAME) as ViewContext
const props = withDefaults(defineProps<{
    width: number,
    height: number,
    top?: number,
    right?: number,
    bottom?: number,
    left?: number,
    title?: string,
    modal?: boolean,
    visible: boolean,
    loading?: boolean,
    keyboardIgnore?: boolean,
    shouldClose?: () => boolean,
}>(), {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    title: '',
    modal: true,
    loading: false,
    keyboardIgnore: false,
})

const emits = defineEmits<{
    (e: 'close'): void;
    (e: 'update:visible', value: boolean): void;
}>()

const temp = reactive({
    x: 0,
    y: 0,
    moving: false,
    mouseX: 0,
    mouseY: 0,
    maskShake: false,
})
const dialogStyle = computed(() => {
    return {
        width: props.width + 'px',
        height: props.height + 'px',
        left: temp.x + 'px',
        top: temp.y + 'px',
    }
})

onMounted(() => {
    if (props.visible) {
        onVisibleChange()
    }
})
onBeforeUnmount(() => {
    if (!props.keyboardIgnore) {
        context.keyboard.popMonopolyKeyboard();
    }
})
watch(() => props.visible, onVisibleChange)
function onVisibleChange() {
    if (props.visible) {
        if (!props.keyboardIgnore) {
            context.keyboard.pushMonopolyKeyboard();
        }
        moveCenter();
    } else {
        if (!props.keyboardIgnore) {
            context.keyboard.popMonopolyKeyboard();
        }
        setTimeout(() => {
            emits("close");
        }, 0);
    }
}
async function onClose() {
    if (props.shouldClose) {
        let shouldClose = await props.shouldClose()
        if (!shouldClose) {
            console.info('close prevented')
            return;
        }
    }
    emits("update:visible", false);
}

function moveCenter() {
    if (props.visible) {
        if (props.left > 0) {
            temp.x = props.left;
        } else if (props.right > 0) {
            temp.x = window.innerWidth - props.right - props.width;
        } else {
            temp.x = (window.innerWidth - props.width) / 2;
        }
        if (props.top > 0) {
            temp.y = props.top;
        } else if (props.bottom > 0) {
            temp.y = window.innerHeight - props.bottom - props.height;
        } else {
            temp.y = (window.innerHeight - props.height) / 2;
        }
    }
}
function onMouseDown(e: MouseEvent) {
    temp.moving = true;
    temp.mouseX = e.screenX;
    temp.mouseY = e.screenY;
    document.onmousemove = onMouseMove;
    document.onmouseup = onMouseUp;
}
function onMouseMove(e: MouseEvent) {
    temp.x += e.screenX - temp.mouseX;
    temp.y += e.screenY - temp.mouseY;
    if (temp.x < 0) {
        temp.x = 0;
    } else if (temp.x > window.innerWidth - props.width) {
        temp.x = window.innerWidth - props.width;
    }
    if (temp.y < 0) {
        temp.y = 0;
    } else if (temp.y > window.innerHeight - props.height) {
        temp.y = window.innerHeight - props.height;
    }
    temp.mouseX = e.screenX;
    temp.mouseY = e.screenY;
}
function onMouseUp() {
    temp.moving = false;
    document.onmousemove = null;
    document.onmouseup = null;
}

function onClickMask() {
    temp.maskShake = true
    setTimeout(() => {
        temp.maskShake = false
    }, 1500)
}
</script>
<template>
    <div>
        <div class="dialog-mask" v-if="modal && visible" @click="onClickMask"></div>
        <transition>
            <div class="dialog popup fixed round border" :class="{ shake: temp.maskShake, readonly: temp.moving }"
                :style="dialogStyle" v-if="visible">
                <slot name="title">
                    <div class="dialog-title frame border" @mousedown="onMouseDown">
                        <b>{{ title }}</b>
                    </div>
                </slot>
                <div class="dialog-content">
                    <slot>
                    </slot>
                    <Loading :visible="loading"></Loading>
                </div>
                <slot name="close">
                    <a class="dialog-close" @click="onClose">
                        <IconClose></IconClose>
                    </a>
                </slot>
            </div>
        </transition>
    </div>
</template>
<style scoped lang="scss">
.dialog-mask {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 21;
}

.dialog {
    display: flex;
    flex-direction: column;
    border-width: 1px;
    overflow: hidden;

    .dialog-title {
        display: flex;
        align-items: center;
        height: var(--size-label);
        padding-left: var(--size-padding);
        border-bottom-width: 1px;
    }

    .dialog-content {
        position: relative;
        flex: 1;
        overflow: auto;
    }

    .dialog-close {
        position: absolute;
        right: 0;
        top: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        width: var(--size-label);
        height: var(--size-label);
        fill: var(--color-text2);
        font-size: 20px;

        &:hover {
            fill: var(--color-white);
            background-color: var(--color-app);
        }
    }
}
</style>