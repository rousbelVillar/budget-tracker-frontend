<script setup>
import Dashboard from "./views/Dashboard.vue";
import { ConfirmDialog, DynamicDialog, Toast} from 'primevue';

</script>

<template>
    <Toast />
    <ConfirmDialog></ConfirmDialog>
    <DynamicDialog />
  <Dashboard/>
</template>

<style scoped></style>
