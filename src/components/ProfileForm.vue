<template>
    <div>
      <form @submit.prevent="onSubmit" class="space-y-4 p-5">
        <div class="flex align-middle justify-center">
          <Avatar v-if="image" :image="image" shape="circle" size="xlarge"></Avatar>
          <Avatar v-else class="relative left-[9vw]" image="https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg" shape="circle" size="xlarge"></Avatar>
          <FileUpload @get-file="getImage"/>
        </div>  
        <div>
          <label for="name" class="flex mt-4">Name</label>
          <InputText id="name" v-model="name" class="w-full" />
        </div>
        <div>
          <label for="lastName" class="flex mt-4">Last Name</label>
          <InputText id="lastName" v-model="lastName" class="w-full"  />
        </div>
        <div>
          <label for="password" class="flex mt-4">Password</label>
          <Password
            id="password"
            v-model="password"
            toggleMask
          />
        </div>
        <div >
        <label for="confirmPassword" class="flex mt-4">Confirm Password</label>
          <Password
            id="confirmPassword"
            v-model="confirmPassword"
            toggleMask
          ></Password>
        </div>
        <Message v-if="selectedFile" class="mt-5 mb-5" size="small" icon="pi pi-images">Image ready to update</Message>     
        <div class="flex mt-3 justify-end gap-3">
              <Button label="Cancel" severity="info" variant="outlined" @click="closeDialog()" />
              <Button type="submit" label="Update" severity="info" />
        </div>
      </form>
    </div>
</template>


<script lang="ts" setup>
import { Avatar, InputText, Button, Message, Password } from 'primevue';
import { inject, onMounted, ref } from 'vue';
import { useAuthStore } from '../store/Auth';
import FileUpload from './FileUpload.vue';


const name = ref("");
const lastName = ref("");
const image = ref("");
const password = ref("");
const confirmPassword = ref("");
const authStore = useAuthStore();
const dialogRef:any = inject('dialogRef');
const selectedFile = ref<File | null>(null);
const auth = useAuthStore();


onMounted(async () => {
  name.value = authStore.user?.name as string ?? '';
  lastName.value = authStore.user?.lastName as string ?? '';  
  image.value = authStore.user?.profileImage as string ?? '';
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
  auth.update_profile("newpassword")
};

</script>