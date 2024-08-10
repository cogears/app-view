<script setup lang="ts">
import ViewContext from '@/ViewContext';
import Button from '@/components/Button.vue';
import Input from '@/components/Input.vue';
import { IInput } from 'types';
import { inject, onMounted, reactive, ref } from 'vue';

const props = defineProps<{
    appName: string,
    background?: string,
    login: (username: string, password: string) => Promise<void>,
}>()
const context = inject(ViewContext.NAME) as ViewContext
const username = ref<IInput>()
const password = ref<IInput>()
const temp = reactive({
    username: '',
    password: '',
    loading: false,
})

onMounted(() => {
    if (username.value) {
        username.value.focus()
    }
})

async function onLogin() {
    if (temp.loading) {
        return
    }
    if (!temp.username) {
        context.device.toast('请输入登录账号')
        return
    }
    if (!temp.password) {
        context.device.toast('请输入登录密码')
        return
    }
    try {
        temp.loading = true
        await props.login(temp.username, temp.password)
    } catch (e) {
        context.device.toast('账号不存在，或者密码不正确')
    } finally {
        temp.loading = false
    }
}

function onNext() {
    if (password.value) {
        password.value.focus()
    }
}
</script>
<template>
    <div class="login-page" v-bg="background">
        <div class="login-mask">
            <div class="form panel shadow">
                <div class="title text1">{{ appName }}</div>
                <div class="option">
                    <Input ref="username" v-model:value="temp.username" placeholder="请输入登录账号"
                        @keydown.enter="onNext"></Input>
                </div>
                <div class="option">
                    <Input ref="password" v-model:value="temp.password" placeholder="请输入登录密码" password
                        @keydown.enter="onLogin"></Input>
                </div>
                <div class="tip text3">
                    <slot name="tip"></slot>
                </div>
                <div class="submit">
                    <Button color="blue" @click="onLogin" :loading="temp.loading">登录</Button>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped lang="scss">
.login-page {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;

    .login-mask {
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        backdrop-filter: blur(10px);
    }


    .form {
        position: relative;
        width: 400px;
        padding: 18px 36px 36px;
        border-radius: 8px;
        margin-top: 20px;

        .title {
            display: flex;
            align-items: center;
            font-size: 32px;
            font-weight: bold;
            margin-bottom: 18px;
        }

        .option {
            height: 36px;
            margin-bottom: 12px;

            .input {
                width: 100%;
            }
        }

        .tip {
            text-align: right;
        }

        .submit {
            margin-top: 20px;
            height: 36px;

            .btn {
                width: 100%;
            }
        }
    }
}
</style>