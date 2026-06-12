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
      <div class="flex gap-1 ">
        <label for="confirmPassword">Profile Picture</label>
        <FileUpload class="align-selft" @get-file="getImage"/>
      </div>
      <Message v-if="selectedFile" class="mt-5 mb-5" size="small" icon="pi pi-images">Image Ready</Message>     
      <div v-if="error" class="text-red-500 text-sm">{{ error }}</div>
      <Button
        type="submit"
        label="Sign Up"
        severity="info"
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
import { Button, InputText, Password, Toast , Message} from "primevue";
import { useRouter } from "vue-router";
import { User} from "../store/Auth";
import FileUpload from "./FileUpload.vue";

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
const selectedFile = ref<File | null>(null);

function getImage(file: File) {
  selectedFile.value = file;
}

const onSubmit = async () => {
  localErrorValue.value = "";
  if (password.value !== confirmPassword.value) {
    auth.error = "Passwords do not match";
    return;
  }
  const user:User = {
    email:email.value,
    name:name.value,
    lastName: lastName.value
  }   
  await auth.register(user,password.value,selectedFile.value);
  router.push("/dashboard");
};
</script>
