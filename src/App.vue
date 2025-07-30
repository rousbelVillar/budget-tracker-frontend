<script setup lang="ts">
import { onMounted } from "vue";
import { useAuthStore } from "./store/Auth";
import Dashboard from "./views/Dashboard.vue";
import { Button, ConfirmDialog, DynamicDialog, Toast} from 'primevue';
import AuthPage from "./components/AuthPage.vue";
const auth = useAuthStore();

onMounted(()=>{
  auth.fetchProfile();
});
</script>

<template>
    <Toast />
    <ConfirmDialog/>
    <DynamicDialog/>
    <div v-if="auth.isAuthenticated">
      <div class="p-4 flex justify-between items-center">
        <div>Welcome, {{ auth.user?.name }}!</div>
      </div>
      <Button label="Logout" @click="auth.logout" severity="secondary" />
      <RouterView />
    </div>

  <div v-else>
    <AuthPage/>
    <RouterView />
  </div>
</template>

<style scoped></style>
