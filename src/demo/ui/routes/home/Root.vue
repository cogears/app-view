<script setup lang="ts">
import Accordion from '@/components/Accordion.vue';
import Tree from '@/components/Tree.vue';
import { reactive } from 'vue';
import Pview from './Pview.vue';

const accordionData = reactive({
    current: 'k1',
    options: [
        { key: 'k1', label: 'kl1' },
        { key: 'k2', label: 'kl2' },
    ]
})

const treeData = reactive({
    current: ['hello'],
    options: [
        {
            key: 'hello',
            label: 'hello',
            selected: false,
            children: [
                {
                    key: 'hello1',
                    label: 'world1',
                    selected: false,
                },
                {
                    key: 'hello2',
                    label: 'hello2',
                    selected: false,
                    children: [
                        {
                            key: 'hello3',
                            label: 'hello3hello3hello3hello3hello3hello3hello3hello3hello3hello3hello3hello3hello3hello3',
                            selected: false,
                            children: [
                                {
                                    key: 'helloz',
                                    label: 'helloz',
                                    selected: false,
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
})

</script>
<template>
    <div class="app-page">
        <div class="top border frame">
            <b>App View</b>
        </div>
        <div class="center space">
            <div class="left border">
                <Accordion :options="accordionData.options" v-model:value="accordionData.current">
                    <template #item-k1>
                        <Tree :options="treeData.options" :border="false" v-model:value="treeData.current"></Tree>
                    </template>
                </Accordion>
            </div>
            <div class="space">
                <Pview></Pview>
            </div>
        </div>
        <div class="foot border frame">&copy; 2024 @cogears</div>
    </div>
</template>
<style scoped lang="scss">
.app-page {
    display: flex;
    flex-direction: column;
    height: 100vh;

    .top {
        display: flex;
        align-items: center;
        height: 2em;
        border-bottom-width: 1px;
        padding: 0 var(--size-padding);
    }

    .foot {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 2em;
        border-top-width: 1px;
    }

    .center {
        display: flex;
    }

    .left {
        width: 200px;
        border-right-width: 1px;
    }
}
</style>