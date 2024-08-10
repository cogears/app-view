<script setup lang="ts">
import { computed, inject, onMounted, reactive } from 'vue';
import ViewContext, { Transaction } from '../ViewContext';
import Button from '../components/Button.vue';
import Dialog from '../components/Dialog.vue';
import Input from '../components/Input.vue';
import { ALERT, CONFIRM, PROMPT } from './index';

const context = inject(ViewContext.NAME) as ViewContext
const temp = reactive({
    visible: false,
    type: '',
    title: '',
    message: '',
    ok: '',
    cancel: '',
    commit: false,
    promptValue: '',
})

const cancelVisible = computed(() => temp.type == 'confirm' || temp.type == 'prompt')

let dialogTransaction: Transaction<any>
onMounted(() => {
    context.device.addEventListener(ALERT, onShowAlert)
    context.device.addEventListener(CONFIRM, onShowConfirm)
    context.device.addEventListener(PROMPT, onShowPrompt)
})

function onShowAlert(_: string, transaction: Transaction<any>, message: string, title?: string, ok?: string) {
    dialogTransaction = transaction
    temp.type = 'alert'
    temp.message = message
    temp.title = title || '提示'
    temp.ok = ok || '确定'
    temp.visible = true
    temp.commit = true
}

function onShowConfirm(_: string, transaction: Transaction<any>, message: string, title?: string, ok?: string, cancel?: string) {
    dialogTransaction = transaction
    temp.type = 'confirm'
    temp.message = message
    temp.title = title || '提示'
    temp.ok = ok || '确定'
    temp.cancel = cancel || '取消'
    temp.visible = true
    temp.commit = false
}

function onShowPrompt(_: string, transaction: Transaction<any>, message: string, title?: string, value?: string) {
    dialogTransaction = transaction
    temp.type = 'prompt'
    temp.message = message
    temp.title = title || '提示'
    temp.promptValue = value || ''
    temp.ok = '确定'
    temp.cancel = '取消'
    temp.visible = true
    temp.commit = false
}

function onClose() {
    if (temp.commit) {
        dialogTransaction.next(temp.promptValue)
    } else {
        dialogTransaction.abort()
    }
    temp.promptValue = ''
}

function onOK() {
    temp.commit = true
    temp.visible = false
}

function onCancel() {
    temp.commit = false
    temp.visible = false
}
</script>
<template>
    <Dialog :width="480" :height="240" :title="temp.title" v-model:visible="temp.visible" @close="onClose">
        <div class="content">
            <div class="message">
                <div v-html="temp.message"></div>
                <Input class="prompt-input" v-model:value="temp.promptValue" v-if="temp.type == 'prompt'"></Input>
            </div>
            <div class="toolbar">
                <Button color="gray" @click="onCancel" v-if="cancelVisible">{{ temp.cancel }}</Button>
                <Button @click="onOK">{{ temp.ok }}</Button>
            </div>
        </div>
        <template #close><i></i></template>
    </Dialog>
</template>
<style scoped lang="scss">
.content {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: calc(var(--size-padding) * 3);

    .message {
        flex: 1;

        .prompt-input {
            width: 100%;
            margin-top: var(--size-padding);
        }
    }
}

.toolbar {
    text-align: right;

    .btn {
        min-width: 80px;

        &+.btn {
            margin-left: calc(var(--size-padding) * 2);
        }
    }
}
</style>