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
  import { onMounted, } from 'vue';
  import SideMenu from '../components/SideMenu.vue';
  import { useTransactionStore } from '../store/Transactions';
  import { useToast } from 'primevue';

  const transactionStore = useTransactionStore();
  const toast = useToast();
  onMounted(() => {
    transactionStore.fetchTransactions()
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
  
  