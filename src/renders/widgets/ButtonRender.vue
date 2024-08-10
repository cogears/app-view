<script setup lang="ts">
import formatter from '@/common/formatter';
import Button from '@/components/Button.vue';
import { ActionEvent, ButtonOptions } from 'types';
import { computed } from 'vue';

const props = defineProps<{
    options: ButtonOptions,
    state: any,
}>()

const label = computed(() => {
    let result = formatter.text(props.options.label, props.state)
    return result
})

const emits = defineEmits<{
    (e: 'action', action: ActionEvent): void
}>()

async function onClick() {
    for (let action of props.options.onClick) {
        await new Promise((resolve, reject) => {
            emits('action', { action, resolve, reject })
        })
    }
}

</script>
<template>
    <Button :color="options.color" :theme="options.theme" :round="options.round" :on="options.on" :readonly="options.readonly" :disabled="options.disabled" @click="onClick">{{ label }}</Button>
</template>
<style scoped lang="scss">
.btn {
    width: 100%;
}
</style>