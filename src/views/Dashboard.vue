<template>
        <!-- <div class="mb-5">
        <label class="block mb-1 font-semibold">Filter by Month</label>
        <Select 
            id="type" 
            test-suite="select-date" 
            name="type" 
            v-model="selected_month" 
            :options="generatePast12Months()" 
            @change="refresh_all"
            optionLabel="name" 
            option-value="value" 
            placeholder="Select a date range" 
            class="w-full md:w-56" />
      </div> -->
    <div class="flex items-stretch content-center">
      <!-- <TransactionForm class="flex-none"/> -->
       <SideMenu class="flex-none"></SideMenu>
      <TransactionList class="flex-auto" ref="list" :month="selected_month" />
      <SummaryChart class="flex-auto" ref="summary" :month="selected_month" />
    </div>
  </template>
  
  <script lang="ts" setup>
  // import TransactionForm from '../components/TransactionForm.vue'
  import TransactionList from '../components/TransactionList.vue'
  import SummaryChart from '../components/SummaryChart.vue';
  import { ref } from 'vue';
  // import { Select } from 'primevue';
  import SideMenu from '../components/SideMenu.vue';
import { useTransactionStore } from '../store/Transactions';

  const store = useTransactionStore()

  const getCurrentMonth = () => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  }

  // const generatePast12Months=()=>{
  //       const months:any = []
  //       const now = new Date()
  //       for (let i = 0; i < 12; i++) {
  //         const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
  //         const year = date.getFullYear()
  //         const month = String(date.getMonth() + 1).padStart(2, '0')
  //         months.push({name:`${year}-${month}`,value:`${year}-${month}`})
  //       }
  //       return months
  //   }
    
  const selected_month = ref<string>(getCurrentMonth());
  const list = ref<InstanceType<typeof TransactionList> | null>(null);
  const summary = ref<InstanceType<typeof SummaryChart> | null>(null);



  const refresh_all = ()=>{
    store.fetchTransactions(selected_month.value);
    //list.value?.fetchTransactions()
    // summary.value?.fetchSummary()
  }

  </script>
  
  <style scoped>
  .input {
    @apply border border-gray-300 rounded w-full px-3 py-2;
  }
  </style>
  
  