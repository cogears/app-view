<script setup lang="ts">
import AppLoading from './AppLoading.vue';
import CalendarPopup from './CalendarPopup.vue';
import ContextMenu from './ContextMenu.vue';
import MessageBox from './MessageBox.vue';
import Toast from './Toast.vue';
</script>
<template>
    <MessageBox></MessageBox>
    <CalendarPopup></CalendarPopup>
    <ContextMenu></ContextMenu>
    <AppLoading></AppLoading>
    <Toast></Toast>
</template>
<style scoped lang="scss"></style>