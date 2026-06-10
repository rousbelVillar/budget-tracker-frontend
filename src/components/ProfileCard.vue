<template>
    <Card>
      <template #title class="profile-card-title">
          <Avatar 
            v-if="user?.profile_image_url"
            :image="user.profile_image_url"
            shape="circle"
            size="xlarge"
            alt="Profile picture"
            "
            >

          </Avatar>
          <Avatar
            v-else
            image="https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg"
            shape="circle"
            size="xlarge"
          />
          <h2 v-if="user" class="text-lg font-semibold">{{ (user?.name) + " " + (user?.lastName)}}</h2> 
          <i v-else class="pi pi-spin pi-spinner" style="font-size: 2rem"></i> 
      </template>
    </Card>
</template>

<script setup lang="ts" >
import { onMounted, computed } from 'vue';
import { useAuthStore } from '../store/Auth';
import { Avatar, Card } from 'primevue';

const authStore = useAuthStore()
const user= computed(()=> authStore.user)

onMounted(async () => {
  await authStore.fetchProfile();
})
</script>
