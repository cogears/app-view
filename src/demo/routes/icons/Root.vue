<script setup lang="ts">
import IconCalendar from '../../../components/icons/IconCalendar.vue';
import IconClose from '../../../components/icons/IconClose.vue';
import IconLoading from '../../../components/icons/IconLoading.vue';
import IconNext from '../../../components/icons/IconNext.vue';
import IconNext2 from '../../../components/icons/IconNext2.vue';
import IconRight from '../../../components/icons/IconRight.vue';


const size = 16
</script>
<template>
    <div class="icons">
        <div>
            <IconCalendar :size="size" />
        </div>
        <div>
            <IconClose :size="size" />
        </div>
        <div>
            <IconLoading :size="size" />
        </div>
        <div>
            <IconNext :size="size" />
        </div>
        <div>
            <IconNext2 :size="size" />
        </div>
        <div>
            <IconRight :size="size" />
        </div>
    </div>
</template>
<style scoped lang="scss">
.icons {
    display: flex;
    flex-wrap: wrap;

    >div {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 48px;
        height: 48px;
    }
}
</style>