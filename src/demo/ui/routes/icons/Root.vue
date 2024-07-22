<script setup lang="ts">
import IconCalendar from '@/components/icons/IconCalendar.vue';
import IconClose from '@/components/icons/IconClose.vue';
import IconLoading from '@/components/icons/IconLoading.vue';
import IconNext from '@/components/icons/IconNext.vue';
import IconNext2 from '@/components/icons/IconNext2.vue';
import IconRight from '@/components/icons/IconRight.vue';

</script>
<template>
    <div class="icons">
        <div>
            <IconCalendar />
            <label>Calendar</label>
        </div>
        <div>
            <IconClose />
            <label>Close</label>
        </div>
        <div>
            <IconLoading />
            <label>Loading</label>
        </div>
        <div>
            <IconNext />
            <label>Next</label>
        </div>
        <div>
            <IconNext2 />
            <label>Next2</label>
        </div>
        <div>
            <IconRight />
            <label>Right</label>
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