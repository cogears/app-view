<script setup lang="ts">
import { inject, onMounted, reactive } from 'vue';
import ViewContext from '../ViewContext';
import { TOAST } from './index';
import { delayTask } from '../common/taskUtil'

const context = inject(ViewContext.NAME) as ViewContext
const temp = reactive({
    visible: false,
    message: '',
})

onMounted(() => {
    context.device.addEventListener(TOAST, onShow)
})

function onShow(_: string, message: string) {
    temp.message = message
    temp.visible = true
    close.run()
}

const close = delayTask(() => {
    temp.visible = false
}, 2000)

</script>
<template>
    <transition>
        <div class="toast popup fixed center round" v-if="temp.visible">{{ temp.message }}</div>
    </transition>
</template>
<style scoped lang="scss">
.toast {
    padding: var(--size-padding);
    white-space: nowrap;
    z-index: 29;
}
</style>