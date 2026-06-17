<template>
    <div>
      <Form class="space-y-4 p-5" @submit.prevent="onSubmit"  ref="formRef" :validateOnValueUpdate="true" :validateOnBlur="true" v-slot="$form" :resolver="registrationResolver" @submit="onSubmit">
        <FormField class="flex align-middle justify-center">
          <Avatar :image="image" shape="circle" size="xlarge"></Avatar>
          <FileUpload @get-file="getImage"/>
        </FormField>  
        <FormField name="name">
          <label for="name" class="flex mt-4">Name</label>
          <InputText id="name" v-model="name" class="w-full" />
        </FormField>
        <FormField>
          <label for="lastName" class="flex mt-4">Last Name</label>
          <InputText id="lastName" v-model="lastName" class="w-full"  />
        </FormField>
        <FormField>
          <label for="password" class="flex mt-4">Password</label>
          <Password
            id="password"
            v-model="password"
            toggleMask
          />
        </FormField>
        <FormField >
        <label for="confirmPassword" class="flex mt-4">Confirm Password</label>
          <Password
            id="confirmPassword"
            v-model="confirmPassword"
            toggleMask
          ></Password>
        </FormField>
        <Message v-if="selectedFile" class="mt-5 mb-5" size="small" icon="pi pi-images">Image ready to update</Message>     
        <div class="flex mt-3 justify-end gap-3">
              <Button label="Cancel" severity="info" variant="outlined" @click="closeDialog()" />
              <Button type="submit" label="Update" severity="info" />
        </div>
      </Form>
    </div>
</template>


<script lang="ts" setup>
import { Avatar, InputText, Button, Message, Password } from 'primevue';
import { inject, onMounted, reactive, ref } from 'vue';
import { useAuthStore } from '../store/Auth';
import FileUpload from './FileUpload.vue';
import { Form, FormField } from '@primevue/forms';
import { UserUpdateForm } from '../interfaces/User';

const name = ref("");
const lastName = ref("");
const image = ref("");
const password = ref("");
const confirmPassword = ref("");
const authStore = useAuthStore();
const dialogRef:any = inject('dialogRef');
const selectedFile = ref<File | null>(null);
const auth = useAuthStore();
const formRef = ref();

const form = reactive<UserUpdateForm>({
  name : "",
  lastName : "",
  password:"",
  confirmPassword:"",
});



onMounted(async () => {
  name.value = authStore.user?.name as string ?? 'Loading';
  lastName.value = authStore.user?.lastName as string ?? 'User';  
  image.value = authStore.user?.profileImageUrl as string ?? 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg';
})

function getImage(file: File) {
  selectedFile.value = file;
}

const closeDialog = () => {
  dialogRef.value.close();
}

const onSubmit = async () => {
  auth.user = {
    name : name.value,
    lastName : lastName.value,
    email : ""
  }
  await auth.update_profile();
};

</script>