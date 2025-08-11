<template>
    <div class="w-100  grid grid-cols-5">
      <SideMenu class="col-span-1" ></SideMenu>
       <TransactionList class="col-span-3" ref="list" />
      <SummaryChart class="col-span-1" ref="summary" />
    </div>
  </template>
  
  <script lang="ts" setup>
  import TransactionList from '../components/TransactionList.vue'
  import SummaryChart from '../components/SummaryChart.vue';
  import { onMounted, ref } from 'vue';
  import SideMenu from '../components/SideMenu.vue';
  import { useDashboardStore } from '../store/Dashboard';
  import { useTransactionStore } from '../store/Transactions';
import { Filter } from '../interfaces/Filter';
import { useToast } from 'primevue';


  const dashboardStore = useDashboardStore();
  const transactionStore = useTransactionStore();
  const list = ref<InstanceType<typeof TransactionList> | null>(null);
  const summary = ref<InstanceType<typeof SummaryChart> | null>(null);
  const toast = useToast();
  onMounted(() => {
    const filter:Filter = {start_date: dashboardStore.selectedStartMonth,end_date:dashboardStore.selectedEndMonth} 
    transactionStore.fetchTransactions(filter)
    .catch(()=>{
      toast.add({ severity: 'error', summary: 'Issues with transaction', detail: 'Unable to retrieve transactions', life: 3000 });
    }).finally(()=>
      transactionStore.loading = false)})
  </script>
  
  <style scoped>
  .input {
    @apply border border-gray-300 rounded w-full px-3 py-2;
  }
  </style>
  
  