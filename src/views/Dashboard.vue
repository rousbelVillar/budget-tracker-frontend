<template>
    <div class="max-w-2xl mx-auto p-4">
      <div class="mb-4">
        <label class="block mb-1 font-semibold">Filter by Month</label>
        <select v-model="selected_month" @change="refresh_all" class="input">
          <option v-for="m in generatePast12Months()" :key="m" :value="m">{{ m }}</option>
        </select>
      </div>
  
      <TransactionForm @submitted="refresh_all" />
      <TransactionList ref="list" :month="selected_month" />
      <SummaryChart ref="summary" :month="selected_month" />
    </div>
  </template>
  
  <script lang="ts" setup>
  import TransactionForm from '../components/TransactionForm.vue'
  import TransactionList from '../components/TransactionList.vue'
  import SummaryChart from '../components/SummaryChart.vue';
  import { ref } from 'vue';

  
  const getCurrentMonth = () => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  }

  const generatePast12Months=()=>{
        const months:string[] = []
        const now = new Date()
        for (let i = 0; i < 12; i++) {
          const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
          const year = date.getFullYear()
          const month = String(date.getMonth() + 1).padStart(2, '0')
          months.push(`${year}-${month}`)
        }
        return months
    }
    
  const selected_month = ref<string>(getCurrentMonth());
  const list = ref<InstanceType<typeof TransactionList> | null>(null)
  const summary = ref<InstanceType<typeof SummaryChart> | null>(null)
  const refresh_all = ()=>{
    list.value?.fetchTransactions()
    summary.value?.fetchSummary()
  }

  </script>
  
  <style scoped>
  .input {
    @apply border border-gray-300 rounded w-full px-3 py-2;
  }
  </style>
  
  