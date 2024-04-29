<script setup lang="ts">
import Input from '../../../components/Input.vue';
import { inject, reactive } from 'vue';
import Button from '../../../components/Button.vue'
import ViewContext from '../../../ViewContext';
import Combobox from '../../../components/Combobox.vue'
import Checkbox from '../../../components/Checkbox.vue';
import Radio from '../../../components/Radio.vue';

const context = inject(ViewContext.NAME) as ViewContext
const options = [
    { key: 'aa', label: 'aa' },
    { key: '', label: 'aa' },
    {
        key: 'bb', label: 'bb', children: [
            {
                key: 'aa1', label: 'aa1', children: [
                    { key: 'cc3', label: 'cccc3' },
                    { key: 'cc4', label: 'cccc4' },
                ]
            },
            {
                key: 'aa2', label: 'aa2', children: [
                    { key: 'cc1', label: 'cccc1' },
                    { key: 'cc2', label: 'cccc2' },
                    { key: 'cc1', label: 'cccc1' },
                    { key: 'cc2', label: 'cccc2' },
                    { key: 'cc1', label: 'cccc1' },
                    { key: 'cc2', label: 'cccc2' },
                    { key: 'cc1', label: 'cccc1' },
                    { key: 'cc2', label: 'cccc2' },
                    { key: 'cc1', label: 'cccc1' },
                    { key: 'cc2', label: 'cccc2' },
                ]
            },
        ]
    }
]
const temp = reactive({
    selected: false,
    radioValue: 'hehe'
})

function onAlert() {
    context.device.prompt('hello world')
}

function onLoading() {
    context.device.loading(true, 'hello world')
}

</script>
<template>
    <div class="options">
        <Button color="blue" @click="onAlert">确定</Button>
        <Button color="blue" round @click="onLoading">确定</Button>
        <Button color="blue" round disabled>确定</Button>
        <Button color="blue" theme="line">确定</Button>
        <Button color="blue" theme="line" round>确定</Button>
    </div>
    <div class="options">
        <Button color="red">red</Button>
        <Button color="red" round>red</Button>
        <Button color="red" round disabled>red</Button>
        <Button color="red" theme="line">red</Button>
        <Button color="red" theme="line" round>red</Button>
    </div>
    <div class="options">
        <Button color="green">green</Button>
        <Button color="green" round>green</Button>
        <Button color="green" round disabled>green</Button>
        <Button color="green" theme="line">green</Button>
        <Button color="green" theme="line" round>green</Button>
    </div>
    <div class="options">
        <Button color="orange">orange</Button>
        <Button color="orange" round>orange</Button>
        <Button color="orange" round disabled>orange</Button>
        <Button color="orange" theme="line">orange</Button>
        <Button color="orange" theme="line" round>orange</Button>
    </div>
    <div class="options">
        <Button color="yellow">yellow</Button>
        <Button color="yellow" round>yellow</Button>
        <Button color="yellow" round disabled>yellow</Button>
        <Button color="yellow" theme="line">yellow</Button>
        <Button color="yellow" theme="line" round>yellow</Button>
    </div>
    <div class="options">
        <Button color="purple">purple</Button>
        <Button color="purple" round>purple</Button>
        <Button color="purple" round disabled>purple</Button>
        <Button color="purple" theme="line">purple</Button>
        <Button color="purple" theme="line" round>purple</Button>
    </div>
    <div class="options">
        <Button color="magenta">magenta</Button>
        <Button color="magenta" round>magenta</Button>
        <Button color="magenta" round disabled>magenta</Button>
        <Button color="magenta" theme="line">magenta</Button>
        <Button color="magenta" theme="line" round>magenta</Button>
    </div>
    <div class="options">
        <Button color="cyan">cyan</Button>
        <Button color="cyan" round>cyan</Button>
        <Button color="cyan" round disabled>cyan</Button>
        <Button color="cyan" theme="line">cyan</Button>
        <Button color="cyan" theme="line" round>cyan</Button>
    </div>
    <div class="options">
        <Button color="gray">取消</Button>
        <Button color="gray" round>取消</Button>
        <Button color="gray" round disabled>取消</Button>
        <Button color="gray" theme="line">取消</Button>
        <Button color="gray" theme="line" round>取消</Button>
    </div>
    <div class="options">
        <Input placeholder="请输入内容..." />
    </div>
    <div class="options">
        <Combobox :options="options"></Combobox>
    </div>
    <div class="options">
        <div style="width: 200px;">
            <Checkbox v-model:selected="temp.selected">选中选中选中选中选中选中选中选中选中选中选中选中选中选中选中选中</Checkbox>
        </div>
        <div style="width: 200px;">
            <Radio v-model:selected="temp.radioValue" value="hehe">选中选中选中选中选中选中选中选中选中选中选中选中选中选中选中选中</Radio>
        </div>
        <div style="width: 200px;">
            <Radio v-model:selected="temp.radioValue" value="haha">选中选中选中选中选中选中选中选中选中选中选中选中选中选中选中选中</Radio>
        </div>
    </div>
</template>
<style scoped lang="scss">
.options {
    display: flex;
    margin: 20px;

    .btn {
        margin-right: 20px;
    }
}
</style>