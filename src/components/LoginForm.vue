<template>
    <div class="max-w-sm mx-auto mt-10 p-4 border rounded-lg shadowe bg-white">
        <h2 class="text-xl font-semibold mb-4">Login</h2>
        <form @submit.prevent="handleLogin" class="flex flex-col gap-4">
            <InputText
            v-model="emailUser"
            placeholder="User name or email"
            type="email"
            :disabled="isLoading"
            required
            />
            <Password
            v-model="password"
            placeholder="Password"
            :feedback="false"
            toggleMask
            :disabled="isLoading"
            required
            />
            <Button
            type="submit"
            label="Login"
            icon="pi pi-sign-in"
            :loading="isLoading"
            class="w-full"
            ></Button>
            <p v-if="error" class="text-red-500 mt-4">{{ error }}</p>
        </form>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useAuthStore } from '../store/Auth';
import { Button, InputText, Password } from 'primevue';
import {useRouter } from 'vue-router';


const emailUser = ref("");
const password = ref("");

const authStore = useAuthStore();
const {login, isLoading, error} = authStore;
const router = useRouter()


const handleLogin = async ()=>{
   if(!emailUser.value || !password.value) return;
   const success = await login({ emailUser:emailUser.value, password : password.value});
   if(success){
      authStore.authenticated = true;
      router.push('/dashboard')
   }
}

</script>