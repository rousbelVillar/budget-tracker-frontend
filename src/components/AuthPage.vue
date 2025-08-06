

<template>
    <div class="min-h-screen flex items-center justify-center">
        <div class="w-full max-w-md p-6 bg-white shadow-lg rounded-lg">
            <div class="flex justify-between mb-6">
                <Button class=" rounded-r-none" label="Login" @click="showLogin = true" :outlined="!showLogin"></Button>
                <Button class=" rounded-r-none" label="Register" @click="showLogin = false" :outlined="showLogin"></Button>
            </div>
            <LoginForm v-if="showLogin"/>
            <RegisterForm v-else/>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Button } from 'primevue';
import LoginForm from '../components/LoginForm.vue'
import RegisterForm from '../components/RegisterForm.vue';

const showLogin = ref(true);
</script>