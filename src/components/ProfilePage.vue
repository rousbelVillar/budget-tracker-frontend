<template>
  <div class="p-2 flex justify-left">
    <Card class="w-50">
      <template #title>
        <div class="flex">
          <Avatar
            image="https://picsum.photos/200/300"
            shape="circle"
            size="xlarge"
          />
          <div>
            <h2 class="text-lg font-semibold ml-5">{{ ("Welcome " + user?.name + "!") || 'Unnamed User' }}</h2>
            <Tag :value="user?.email" severity="info" class="float-left ml-5" />
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts" >
import { onMounted, computed } from 'vue';
import { useAuthStore } from '../store/Auth';
import { Avatar, Card, Tag } from 'primevue';

const authStore = useAuthStore()
const user = computed(()=> authStore.user)

onMounted(async () => {
  await authStore.fetchProfile()
})
</script>
