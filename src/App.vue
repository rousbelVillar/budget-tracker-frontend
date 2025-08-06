

<template>
    <Toast />
    <ConfirmDialog/>
    <DynamicDialog/>
    <div v-if="auth.isAuthenticated">
      <div class="p-4 flex justify-between items-center">
        <div>Welcome, {{ auth.user?.name }}!</div>
      </div>
      <Button label="Logout" @click="logout()" severity="secondary" />
      <RouterView />
    </div>

  <div v-else>
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "./store/Auth";
import { Button, ConfirmDialog, DynamicDialog, Toast} from 'primevue';
import { useRouter } from "vue-router";
import { onMounted } from "vue";
import { getCookie } from "./globals/globals";
const auth = useAuthStore();
const router = useRouter();


const logout =()=>{
  auth.logout().then(()=> {
    router.push("/auth")
  });
}
  onMounted(() =>  {
    auth.authenticated = !!getCookie('csrf_access_token');
    if(auth.authenticated){
      auth.fetchProfile();
    }
  })
</script>
<style scoped></style>
