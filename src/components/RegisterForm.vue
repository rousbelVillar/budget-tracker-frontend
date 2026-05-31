<template>
  <div class="max-w-md mx-auto p-5 shadow-md rounded-xl bg-white">
    <h2 class="text-2xl font-bold mb-4">Create an account</h2>
    <form @submit.prevent="onSubmit" class="space-y-4 p-5">
      <div>
        <label for="name" class="flex">Name</label>
        <InputText id="name" v-model="name" class="w-full" required />
      </div>
      <div>
        <label for="lastName" class="flex">Last Name</label>
        <InputText id="lastName" v-model="lastName" class="w-full" required />
      </div>
      <div>
        <label for="email" class="flex">Email</label>
        <InputText id="email" v-model="email" class="w-full" required>
        </InputText>
      </div>
      <div>
        <label for="password" class="flex">Password</label>
        <Password
          id="password"
          v-model="password"
          class="w-full"
          toggleMask
          required
        />
      </div>
      <div>
        <label for="confirmPassword" class="flex">Confirm Password</label>
        <Password
          id="confirmPassword"
          v-model="confirmPassword"
          class="w-full"
          toggleMask
          required
        ></Password>
      </div>

      <FileUpload
        mode="basic"
        name="demo[]"
        url="/api/upload"
        accept="image/*"
        uploadLabel="Test3"
        :maxFileSize="1000000"
        :chooseButtonProps="{severity:'contrast' , size:'small', icon:'pi pi-images'}"
        @select="onFileSelect"
      >
      </FileUpload>
      <div v-if="error" class="text-red-500 text-sm">{{ error }}</div>
      <Button
        type="submit"
        label="Sign Up"
        :loading="isLoading"
        class="w-full"
      ></Button>
    </form>
  </div>
  <Toast />
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useAuthStore } from "../store/Auth";
import { Button, InputText, Password, Toast, FileUpload } from "primevue";
import { useRouter } from "vue-router";

const name = ref("");
const lastName = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const localErrorValue = ref("");

const auth = useAuthStore();
const isLoading = computed(() => auth.isLoading);
const error = computed(() => auth.error);
const router = useRouter();
const src = ref(null);

function onFileSelect(event:any) {
    const file = event.files[0];
    const reader = new FileReader();

    reader.onload = async (e:any) => {
        src.value = e.target.result;
    };

    reader.readAsDataURL(file);
    console.log("image added");
}

const onSubmit = async () => {
  localErrorValue.value = "";
  if (password.value !== confirmPassword.value) {
    auth.error = "Passwords do not match";
    return;
  }
  await auth.register(name.value, email.value, password.value);
  router.push("/dashboard");
};
</script>
