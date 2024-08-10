<script setup lang="ts">
import * as icons from '@/components/icons';
import { computed } from 'vue';

const keys = computed(() => Object.keys(icons))
function getIcon(key: string) {
    //@ts-ignore
    return icons[key]
}

</script>
<template>
    <div class="icons">
        <div v-for="key in keys">
            <component :is="getIcon(key)"></component>
            <label>{{ key.substring(4) }}</label>
        </div>
    </div>
</template>
<style scoped lang="scss">
.icons {
    display: flex;
    flex-wrap: wrap;

    >div {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 64px;
        height: 64px;

        .icon {
            font-size: 20px;
        }

        label {
            font-size: 14px;
        }
    }
}
</style>