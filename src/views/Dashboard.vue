<template>
    <div class="flex items-stretch content-center">
       <SideMenu class="flex-none"></SideMenu>
      <TransactionList class="flex-auto" ref="list" :month="selected_month" />
      <SummaryChart class="flex-auto" ref="summary" :month="selected_month" />
    </div>
  </template>
  
  <script lang="ts" setup>
  import TransactionList from '../components/TransactionList.vue'
  import SummaryChart from '../components/SummaryChart.vue';
  import { onMounted, ref } from 'vue';
  import SideMenu from '../components/SideMenu.vue';
  import { useDashboardStore } from '../store/Dashboard';

  const dashboardStore = useDashboardStore();
  const selected_month = ref<string>('');
  const list = ref<InstanceType<typeof TransactionList> | null>(null);
  const summary = ref<InstanceType<typeof SummaryChart> | null>(null);

  onMounted(() => {
    const now = new Date()
    dashboardStore.setSelectedMonth(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`)
  });
  </script>
  
  <style scoped>
  .input {
    @apply border border-gray-300 rounded w-full px-3 py-2;
  }
  </style>
  
  