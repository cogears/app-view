<script setup lang="ts">
import Link from '@/components/Link.vue';
import { MenuOption } from 'types';
import { computed, inject } from 'vue';
import ViewContext from '../ViewContext';

const context = inject(ViewContext.NAME) as ViewContext
const route = computed(() => context.router.currentRoute.value)

defineProps<{
    appName: string;
    appLogo?: string;
    userName?: string,
    navigators: MenuOption<string>[],
}>()

const emits = defineEmits<{
    (e: 'quit'): void
}>()

function linkClass(item: MenuOption<string>, isChildren: boolean) {
    if (item.children && item.children.length > 0) {
        if (item.children.some(child => route.value.fullPath.startsWith(child.key))) {
            return 'on'
        }
        if (isChildren) {
            return 'popup'
        }
    } else {
        if (route.value.fullPath.startsWith(item.key)) {
            return 'on hover'
        }
    }
}

function onClickLink(item: MenuOption<string>) {
    context.router.push(item.key)
}

function onQuit() {
    emits('quit')
}
</script>
<template>
    <div class="works panel">
        <div class="full">
            <slot></slot>
        </div>
        <div class="side frame border">
            <div class="logo">
                <img :src="appLogo" v-if="appLogo">
                <b>{{ appName }}</b>
            </div>
            <div class="navigators">
                <div class="nav-group" v-for="item in navigators">
                    <a class="nav-link" :class="linkClass(item, false)" @click="onClickLink(item)">
                        <i></i><span>{{ item.label }}</span>
                    </a>
                    <div class="nav-children" :class="linkClass(item, true)" v-if="item.children && item.children.length > 0">
                        <a class="nav-link" :class="linkClass(child, false)" v-for="child in item.children" @click="onClickLink(child)">
                            <span>{{ child.label }}</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
        <div class="top frame border">
            <span class="page-name">{{ route.name }}</span>
            <span class="space"></span>
            <span class="item" v-if="userName">{{ userName }}</span>
            <Link class="item" @click="onQuit">退出</Link>
        </div>
    </div>
</template>
<style scoped lang="scss">
$side-width: 200px;
$top-height: 60px;
$page-padding: 24px;

.works {
    position: relative;
    height: 100vh;
    overflow: hidden;
    padding-left: $side-width;
    padding-top: $top-height;

    .full {
        height: 100%;
        padding: $page-padding;
        overflow: auto;
    }

    .side {
        position: fixed;
        left: 0;
        top: 0;
        bottom: 0;
        width: $side-width;
        border-right-width: 1px;

        .logo {
            display: flex;
            align-items: center;
            height: $top-height;
            padding-left: 16px;

            img {
                width: 24px;
                height: 24px;
                margin-right: 4px;
            }

            b {
                font-size: 20px;
            }
        }
    }

    .top {
        position: fixed;
        left: $side-width;
        right: 0;
        top: 0;
        height: $top-height;
        border-bottom-width: 1px;
        display: flex;
        align-items: center;
        padding: 0 24px;

        .page-name {
            font-size: 18px;
        }

        .item {
            &+.item {
                margin-left: 24px;
            }
        }
    }
}

.navigators {
    padding: 0 8px;

    .nav-group {
        position: relative;

        &+.nav-group {
            margin-top: 2px;
        }

        .nav-children {
            &.popup {
                display: none;
                left: 100%;
                top: -4px;
                padding: 4px 6px;
                border-radius: 4px;

                .nav-link {
                    padding: 0 24px 0 8px;
                }
            }
        }

        &:hover {
            .nav-children {
                &.popup {
                    display: block;
                }
            }
        }
    }

    .nav-link {
        position: relative;
        display: flex;
        align-items: center;
        height: 36px;
        padding-left: 32px;
        border-radius: 6px;
        margin-top: 2px;

        i {
            position: absolute;
            left: 12px;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background-color: var(--color-text3);
        }

        span {
            white-space: nowrap;
        }

        &:hover,
        &.hover {
            background-color: var(--color-border);
        }

        &.on {
            font-weight: bold;

            i {
                background-color: var(--color-text2);
            }
        }
    }

}
</style>