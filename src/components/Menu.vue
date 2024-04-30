<script setup lang="ts">
import { MenuOption } from 'types';
import MenuItem from './MenuItem.vue';

defineProps<{
    options: MenuOption[],
    mode?: 'checkbox',
}>()
const emits = defineEmits<{
    (e: 'selected', items: MenuOption[]): void
}>()

function onSelected(items: MenuOption[]) {
    emits('selected', items)
}

</script>
<template>
    <div class="menu popup">
        <template v-for="item in options">
            <MenuItem :item="item" :mode="mode" @selected="onSelected" v-if="item.key">
            </MenuItem>
            <div class="separate" v-else></div>
        </template>
    </div>
</template>
<style scoped lang="scss">
.menu {
    padding: 4px 0;

    .separate {
        margin: 4px 8px;
        height: 1px;
        background-color: var(--color-border);
    }
}
</style>