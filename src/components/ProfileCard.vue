<template>
    <Card class="profile-card flex flex-direction">
      <template #title>
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
      </template>
      <template #content>
          <h2 class="profile-card-title text-lg font-semibold ml-5">{{ (user?.name ) || 'Unnamed User' }}</h2>
          <!-- <Tag :value="user?.email" severity="info" class="float-left ml-5" /> -->
      </template>
    </Card>
</template>

<script setup lang="ts" >
import { onMounted, computed } from 'vue';
import { useAuthStore } from '../store/Auth';
import { Avatar, Card, Tag } from 'primevue';

const authStore = useAuthStore()
const user= computed(()=> authStore.user)

onMounted(async () => {
  await authStore.fetchProfile();
})
</script>
