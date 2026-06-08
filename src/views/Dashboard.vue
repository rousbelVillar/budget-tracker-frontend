<template>
    <div v-if="loadingCondition" 
      class="w-100  grid grid-cols-5" >
      <SideMenu class="col-span-1" ></SideMenu>
       <TransactionList class="col-span-3" ref="list" />
      <SummaryChart class="col-span-1" ref="summary" />
    </div>
    <template v-else>
      <Image src="http://localhost:5173/src/assets/Budget-app-loading.gif" class="w-[700px] absolute top-[11vh] left-[24vw]"></Image>
    </template>
  </template>

  <script lang="ts" setup>
  import TransactionList from '../components/TransactionList.vue'
  import SummaryChart from '../components/SummaryChart.vue';
  import { onMounted, } from 'vue';
  import SideMenu from '../components/SideMenu.vue';
  import { useTransactionStore } from '../store/Transactions';
  import { Image, useToast } from 'primevue';
  import { useAuthStore } from '../store/Auth.js';

  const transactionStore = useTransactionStore();
  const loadingCondition = !transactionStore.loading;
  const toast = useToast();
  onMounted(() => {
    transactionStore.fetchTransactions()
    .catch(()=>{
      toast.add({ severity: 'error', summary: 'Issues with transaction', detail: 'Unable to retrieve transactions', life: 3000 });
    }).finally(()=>
      transactionStore.loading = false)
})
  </script>
  
  <style scoped>
  .input {
    @apply border border-gray-300 rounded w-full px-3 py-2;
  }
  </style>
  
  