<script setup lang="ts">
import ViewContext from '@/ViewContext';
import { AppContext, AppNavigator } from 'types';
import { computed, inject } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const context = inject(ViewContext.NAME) as AppContext
const router = useRouter()
const route = useRoute()

const appName = computed(() => context.appState.name)
const appLogo = computed(() => context.appState.logo)
const navigators = computed(() => context.appNavigators)

function linkClass(item: AppNavigator, isChildren: boolean) {
    if (item.children && item.children.length > 0) {
        if (item.children.some(child => route.fullPath.startsWith(child.path))) {
            return 'on'
        }
        if (isChildren) {
            return 'popup'
        }
    } else {
        if (route.fullPath.startsWith(item.path)) {
            return 'on hover'
        }
    }
}

function onClickLink(item: AppNavigator) {
    router.push(item.path)
}

</script>
<template>
    <div class="works panel">
        <div class="side frame border">
            <div class="logo">
                <img :src="appLogo">
                <b>{{ appName }}</b>
            </div>
            <div class="navigators">
                <div class="nav-group" v-for="item in navigators">
                    <a class="nav-link" :class="linkClass(item, false)" @click="onClickLink(item)">
                        <i></i><span>{{ item.label }}</span>
                    </a>
                    <div class="nav-children" :class="linkClass(item, true)"
                        v-if="item.children && item.children.length > 0">
                        <a class="nav-link" :class="linkClass(child, false)" v-for="child in item.children"
                            @click="onClickLink(child)">
                            <span>{{ child.label }}</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
        <div class="top frame border"></div>
        <slot></slot>
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
    padding-left: $side-width+$page-padding;
    padding-right: $page-padding;
    padding-top: $top-height+$page-padding;
    padding-bottom: $page-padding;

    .side {
        position: absolute;
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
        position: absolute;
        left: $side-width;
        right: 0;
        top: 0;
        height: $top-height;
        border-bottom-width: 1px;
        display: flex;
        align-items: center;
        padding: 0 24px;

        .page-name {
            font-weight: 18px;

            .btn {
                height: 36px;
                margin-right: 12px;
            }
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