

<template>
    <Toast />
    <ConfirmDialog/>
    <DynamicDialog/>
    <RouterView />
</template>

<script setup lang="ts">
import { useAuthStore } from "./store/Auth";
import { ConfirmDialog, DynamicDialog, Toast} from 'primevue';
import { onMounted } from "vue";
import { getCookie } from "./globals/globals";
const auth = useAuthStore();



  onMounted(() =>  {
    auth.authenticated = !!getCookie('csrf_access_token');
    if(auth.authenticated){
      auth.fetchProfile();
    }
  })
</script>
<style scoped></style>
