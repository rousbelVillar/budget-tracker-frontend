<template>
  <ProfilePage/>
    <div class="flex items-stretch content-center">
       <SideMenu class="flex-none"></SideMenu>
      <TransactionList class="flex-auto" ref="list" :month="dashboardStore.selectedMonth" />
      <SummaryChart class="flex-auto" ref="summary" :month="dashboardStore.selectedMonth" />

    </div>
  </template>
  
  <script lang="ts" setup>
  import TransactionList from '../components/TransactionList.vue'
  import SummaryChart from '../components/SummaryChart.vue';
  import { onMounted, ref } from 'vue';
  import SideMenu from '../components/SideMenu.vue';
  import { useDashboardStore } from '../store/Dashboard';
  import { useTransactionStore } from '../store/Transactions';
  import ProfilePage from '../components/ProfilePage.vue';

  const dashboardStore = useDashboardStore();
  const transactionStore = useTransactionStore();
  const list = ref<InstanceType<typeof TransactionList> | null>(null);
  const summary = ref<InstanceType<typeof SummaryChart> | null>(null);
  onMounted(() => {
    transactionStore.fetchTransactions(dashboardStore.selectedMonth)
  })
  </script>
  
  <style scoped>
  .input {
    @apply border border-gray-300 rounded w-full px-3 py-2;
  }
  </style>
  
  