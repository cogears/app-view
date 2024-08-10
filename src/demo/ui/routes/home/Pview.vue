<script setup lang="ts">
import { Column } from 'types';
import { inject, reactive, ref } from 'vue';
import ViewContext from '@/ViewContext';
import Button from '@/components/Button.vue';
import Calendar from '@/components/Calendar.vue';
import Checkbox from '@/components/Checkbox.vue';
import Combobox from '@/components/Combobox.vue';
import DataTable from '@/components/DataTable.vue';
import Input from '@/components/Input.vue';
import Radio from '@/components/Radio.vue';
import Scroller from '@/components/Scroller.vue';
import SwitchBar from '@/components/SwitchBar.vue';
import Switcher from '@/components/Switcher.vue';
import TabPages from '@/components/TabPages.vue';
import Uploader from '@/components/Uploader.vue';
import Pagination from '@/components/Pagination.vue'
import Link from '@/components/Link.vue'
import IconSearch from '@/components/icons/IconSearch.vue'

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
const tpages = [
    { key: 'p1', label: 'p1' },
    { key: 'p2', label: 'p2' },
    { key: 'p3', label: 'p3' },
]
const temp = reactive({
    selected: false,
    radioValue: 'hehe',
    comValue: '',
    date: new Date(),
    tvalue: 'p1',
})

const columns = ref<Column[]>([
    { key: 'key', label: '阿斯蒂芬阿斯蒂芬安师傅按手阿萨德a', width: 100, fixed: true, sort: 'none', setting: true },
    { key: 'label', label: 'f2223', width: 500, sort: 'none', align: 'right', setting: true },
    { key: 'label2', label: 'f2', width: 500, sort: 'none' },
    { key: 'p3', label: '阿斯蒂芬阿斯蒂芬安师傅按手阿萨德a', width: 100, suffix: true, setting: true },
])

const tdata = ref<any[]>([
    { key: '13', label: '123', p3: 'sdag' },
    { key: '13', label: '123', p3: 'sdag' },
    { key: '13', label: '123', p3: 'sdag' },
    { key: '13', label: '123', p3: 'sdag' },
])

function onTableSetting(c: Column) {
    console.info('table setting', c)
}

function onAlert() {
    context.device.prompt('hello world')
}

function onLoading() {
    context.device.loading(true, 'hello world')
}

const files = ref<any[]>([])
async function onUpload(file: File) {
    return URL.createObjectURL(file)
}

</script>
<template>
    <div class="panel">
        <div class="options" style="height: 300px;">
            <Scroller :border="true">
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
            </Scroller>
        </div>
        <div class="options">
            <TabPages :options="tpages" v-model:value="temp.tvalue">
                <template #p1>
                    <div class="options">
                        <div class="wrap">
                            <Input placeholder="请输入内容...">
                            <template #suffix-icon>
                                <IconSearch />
                            </template>
                            </Input>
                        </div>
                        <div class="wrap">
                            <Combobox :options="options" v-model:value="temp.comValue" style="width: 100px" :clear-visible="true"></Combobox>
                        </div>
                        <div class="wrap">
                            <Calendar v-model:value="temp.date"></Calendar>
                        </div>
                        <div class="wrap">
                            <SwitchBar :options="options" v-model:value="temp.comValue"></SwitchBar>
                        </div>
                        <div class="wrap">
                            <Uploader type="image" :value="files" :upload="onUpload"></Uploader>
                        </div>
                    </div>
                </template>
                <template #p2>
                    <div class="options">
                        <div style="width: 200px;">
                            <Checkbox v-model:selected="temp.selected">选中选中选中选中选中选中选中选中选中选中选中选中选中选中选中选中</Checkbox>
                        </div>
                        <div style="width: 200px;">
                            <Radio v-model:selected="temp.radioValue" value="hehe">选中选中选中选中选中选中选中选中选中选中选中选中选中选中选中选中
                            </Radio>
                        </div>
                        <div style="width: 200px;">
                            <Radio v-model:selected="temp.radioValue" value="haha">选中选中选中选中选</Radio>
                        </div>
                        <div class="wrap">
                            <Switcher v-model:value="temp.selected"></Switcher>
                        </div>
                    </div>
                </template>
                <template #p3>
                    <div class="options">
                        <Link more>查看更多</Link>
                    </div>
                </template>
            </TabPages>
        </div>
        <div class="options" style="height:200px">
            <DataTable :columns="columns" :data="tdata" :sort="true" @setting="onTableSetting"></DataTable>
        </div>
        <div class="options">
            <Pagination :page="3" :size="20" :total="100"></Pagination>
        </div>
        <div class="options">
            <Input :textarea="true"></Input>
        </div>
    </div>
</template>
<style scoped lang="scss">
.panel {
    height: 100%;
    overflow: auto;
}

.options {
    display: flex;
    margin: 20px;

    .btn {
        margin-right: 20px;
    }
}

.wrap {
    &+.wrap {
        margin-left: 20px;
    }
}
</style>