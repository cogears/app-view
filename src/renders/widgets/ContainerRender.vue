<script setup lang="ts">
import { ActionEvent, ContainerOptions } from 'types';
import { computed } from 'vue';
import NodeRender from './NodeRender.vue';
import Loading from '@/components/Loading.vue';

const props = defineProps<{
    options: ContainerOptions,
    state: any,
    loading?: boolean
}>()

const classnames = computed(() => {
    let arr: string[] = [props.options.direction || 'row', props.options.align || 'left']
    return arr
})

const emits = defineEmits<{
    (e: 'action', event: ActionEvent): void
}>()

function onAction(event: ActionEvent) {
    emits('action', event)
}
</script>
<template>
    <div class="container-render" :class="classnames">
        <NodeRender v-for="item in options.children" :options="item" :state="state" @action="onAction"></NodeRender>
        <Loading :visible="loading"></Loading>
    </div>
</template>
<style scoped lang="scss">
.container-render {
    display: flex;
    width: 100%;
    height: 100%;
    line-height: 1.5;
    overflow: auto;
    position: relative;

    &.row {
        &.left {
            justify-content: flex-start;
        }

        &.center {
            justify-content: center;
        }

        &.right {
            justify-content: flex-end;
        }

        >.node-render {
            &+.node-render {
                margin-left: 2em;
            }
        }
    }

    &.column {
        flex-direction: column;

        >.node-render {
            &+.node-render {
                margin-top: 1.5em;
            }
        }
    }


}
</style>