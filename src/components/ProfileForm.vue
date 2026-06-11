<template>
    <div>
      <div class="relative right-[35%]">
        <Avatar v-if="image" class="relative left-[9vw]" :image="image" shape="circle" size="xlarge"></Avatar>
        <Avatar v-else class="relative left-[9vw]" image="https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg" shape="circle" size="xlarge"></Avatar>
        <Button name="edit" class="relative left-[67%] bottom-[5vh] " size="small" severity="info" icon="pi pi-pencil" rounded aria-label="Filter" />
      </div>  
      <div>
        <label for="name" class="flex">Name</label>
        <InputText id="name" v-model="name" class="w-full" required />
      </div>
      <div>
        <label for="lastName" class="flex mt-4">Last Name</label>
        <InputText id="lastName" v-model="lastName" class="w-full" required />
      </div>
      <div class="flex mt-3 justify-end gap-3">
            <Button label="Cancel" severity="info" variant="outlined" />
            <Button label="Update" severity="info" />
      </div>
    </div>
</template>


<script lang="ts" setup>
import { Avatar, InputText, Button } from 'primevue';
import { onMounted, ref } from 'vue';
import { useAuthStore } from '../store/Auth';

const name = ref("");
const lastName = ref("");
const image = ref("");
const authStore = useAuthStore();

onMounted(async () => {
  name.value = authStore.user?.name as string ?? '';
  lastName.value = authStore.user?.lastName as string ?? '';  
  image.value = authStore.user?.profileImage as string ?? '';
})

</script>