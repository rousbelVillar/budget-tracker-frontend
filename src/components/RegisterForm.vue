<template>
  <div class="max-w-md mx-auto p-5 shadow-md rounded-xl bg-white">
    <h2 class="text-2xl font-bold mb-4">Create an account</h2>
    <Form ref="formRef" :validateOnValueUpdate="true" :validateOnBlur="true" v-slot="$form" :resolver="registrationResolver" @submit="onSubmit" class="space-y-4 p-5">
      <FormField name="name">
        <label for="name" class="flex">Name</label>
        <InputText test-suite="input-name" id="name" v-model="name" class="w-full" fluid/>
        <Message v-if="$form.name?.invalid" severity="error" size="small" variant="simple">{{ $form.name.errors }}</Message>
      </FormField>
      <FormField name="lastName">
        <label for="lastName" class="flex">Last Name</label>
        <InputText test-suite="input-name" id="lastName" v-model="lastName" class="w-full" fluid />
        <Message v-if="$form.lastName?.invalid" severity="error" size="small" variant="simple">{{ $form.lastName.errors }}</Message>
      </FormField>
      <FormField name="email">
        <label for="email" class="flex">Email</label>
        <InputText id="email" v-model="email" class="w-full" fluid/>
        <Message v-if="$form.email?.invalid" severity="error" size="small" variant="simple">{{ $form.email.errors }}</Message>
      </FormField>
      <FormField name="password">
        <label for="password" class="flex">Password</label>
        <Password
          id="password"
          v-model="password"
          class="w-full"
          toggleMask
          fluid
        />
        <Message v-if="$form.password?.invalid" severity="error" size="small" variant="simple">{{ $form.password.errors }}</Message>
      </FormField>
      <FormField name="confirmPassword">
        <label for="confirmPassword" class="flex">Confirm Password</label>
        <Password
          id="confirmPassword"
          v-model="confirmPassword"
          class="w-full"
          toggleMask
          fuid
        ></Password>
        <Message v-if="$form.confirmPassword?.invalid" severity="error" size="small" variant="simple">{{ $form.confirmPassword.errors }}</Message>
      </FormField>
      <div class="flex gap-1 ">
        <label for="confirmPassword">Profile Picture</label>
        <FileUpload @get-file="getImage"/>
      </div>
      <Message v-if="selectedImage" class="mt-5 mb-5" size="small" icon="pi pi-images">Image Ready</Message>     
      <div v-if="error" class="text-red-500 text-sm">{{ error }}</div>
      <Button
        type="submit"
        label="Sign Up"
        severity="info"
        :loading="isLoading"
        class="w-full"
        :disabled="!$form.valid"
      ></Button>
    </Form>
  </div>
  <Toast />
</template>

<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import { useAuthStore } from "../store/Auth";
import { Button, InputText, Password, Toast , Message, useToast} from "primevue";
import { useRouter } from "vue-router";
import FileUpload from "./FileUpload.vue";
import { Form, FormField } from "@primevue/forms";
import { registrationResolver, registrationValidation } from "../validation/registrationResolvers";
import { UserForm } from "../interfaces/User";
import { showToast } from "../globals/globals";

const name = ref("");
const lastName = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const localErrorValue = ref("");
const formRef = ref();
const toast = useToast();
const form = reactive<UserForm>({
  name : "",
  lastName : "",
  email:"",
  password:"",
  confirmPassword:""
});

const auth = useAuthStore();
const isLoading = computed(() => auth.isLoading);
const error = computed(() => auth.error);
const router = useRouter();
const selectedImage = ref<File | null>(null);

function getImage(file: File) {
  selectedImage.value = file;
}

const onSubmit = async () => {
  const result = await formRef.value?.validate();
  if(Object.keys(result.errors).length === 0 || registrationValidation(form)){
      localErrorValue.value = "";
      auth.user = {
        email:email.value,
        name:name.value,
        lastName: lastName.value,
        password:password.value,
      }   
      if(selectedImage.value){
        auth.user.profileImage = selectedImage.value;
      }
      await auth.register().catch((e:any)=>{
          showToast(toast,e.response.data.error || 'Error Signing Up.','error')
        })
      router.push("/dashboard");
    };
  }

  
</script>
