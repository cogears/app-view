<script setup lang="ts">
import { delayTask } from '../common/taskUtil';
import { reactive, watchEffect } from 'vue';
import IconLoading from "./icons/IconLoading.vue";
const props = withDefaults(defineProps<{
    tip?: string,
    visible?: boolean,
    fixed?: boolean,
}>(), {
    visible: false,
    fixed: false,
})
const temp = reactive({
    visible: false
})
const closeTask = delayTask(() => {
    temp.visible = false
}, 100)

watchEffect(() => {
    closeTask.cancel()
    if (props.visible) {
        temp.visible = true
    } else {
        closeTask.run()
    }
})
</script>
<template>
    <div class="loading" :class="{ fixed: fixed }" v-if="temp.visible">
        <div class="round" :class="{ popup: fixed }">
            <IconLoading class="rotate"></IconLoading>
            <slot>
                <div class="tip" v-if="tip">{{ tip }}</div>
            </slot>
        </div>
    </div>
</template>
<style scoped lang="scss">
.loading {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;

    &.fixed {
        z-index: 28;
    }

    >div {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 16px 32px;
    }

    .icon {
        font-size: 20px;
    }

    .tip {
        text-align: center;
        max-width: 300px;
        word-break: break-all;
    }
}
</style>