<template >
    <Card v-if="user" >
      <template #title class="profile-card-title">
          <Avatar 
            :image="user.profileImageUrl"
            shape="circle"
            size="xlarge"
            alt="Profile picture"
            "
            >
          </Avatar>
          <h2 class="text-lg font-semibold">{{ (user?.name) + " " + (user?.lastName)}}</h2> 
      </template>
    </Card>
    <template v-else>
    <i  class="pi pi-spin pi-spinner" style="font-size: 2rem"></i> 
  </template>
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
