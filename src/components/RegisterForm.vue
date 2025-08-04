<template>
    <div class="max-w-md mx-auto p-4 shadow-md rounded-xl bg-white">
        <h2 class="text-2xl font-bold mb-4">Create an account</h2>
        <form @submit.prevent="onSubmit" class="space-y-4">
            <div>
                <label for="name">Name</label>
                <InputText id="name" v-model="name" class="w-full" required/>
            </div>
            <div>
                <label for="email">Email</label>
                <InputText id="email" v-model="email" class="w-full" required> </InputText>
            </div>
            <div>
                <label for="password">Password</label>
                <Password id="password" v-model="password" class="w-full" toggleMask required/>
            </div>
            <div>
                <label for="confirmPassword">Confirm Password</label>
                <Password id="confirmPassword" v-model="confirmPassword" class="w-full" toggleMask required></Password>
            </div>
            <div v-if="error" class="text-red-500 text-sm">{{ error }}</div>
            <Button type="submit" label="Sign Up" :loading="isLoading" class="w-full"></Button>        
        </form>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useAuthStore } from '../store/Auth';
import { Button, InputText, Password } from 'primevue';
import { useRouter } from 'vue-router';

const name = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const localErrorValue = ref('');

const auth = useAuthStore();
const isLoading = computed(()=> auth.isLoading);
const error = computed(()=> auth.error);
const router = useRouter();


const onSubmit = async () => {

    localErrorValue.value = "";
    if(password.value !== confirmPassword.value){
        auth.error = "Passwords do not match";
        return;
    }
    await auth.register( name.value, email.value,password.value)
    
}
</script>