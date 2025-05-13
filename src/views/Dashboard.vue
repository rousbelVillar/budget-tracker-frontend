<template>
    <div class="max-w-2xl mx-auto p-4">
      <div class="mb-4">
        <label class="block mb-1 font-semibold">Filter by Month</label>
        <select v-model="selectedMonth" @change="refreshAll" class="input">
          <option v-for="m in months" :key="m" :value="m">{{ m }}</option>
        </select>
      </div>
  
      <TransactionForm @submitted="refreshAll" />
      <TransactionList ref="list" :month="selectedMonth" />
      <SummaryChart ref="summary" :month="selectedMonth" />
    </div>
  </template>
  
  <script>
  import TransactionForm from '../components/TransactionForm.vue'
  import TransactionList from '../components/TransactionList.vue'
  import SummaryChart from '../components/SummaryChart.vue'
  
  const getCurrentMonth = () => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  }
  
  export default {
    components: { TransactionForm, TransactionList, SummaryChart },
    data() {
      return {
        selectedMonth: getCurrentMonth(),
        months: this.generatePast12Months(),
      }
    },
    methods: {
      refreshAll() {
        this.$refs.list.fetchTransactions()
        this.$refs.summary.fetchSummary()
      },
      generatePast12Months() {
        const months = []
        const now = new Date()
        for (let i = 0; i < 12; i++) {
          const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
          const year = date.getFullYear()
          const month = String(date.getMonth() + 1).padStart(2, '0')
          months.push(`${year}-${month}`)
        }
        return months
      },
    },
  }
  </script>
  
  <style scoped>
  .input {
    @apply border border-gray-300 rounded w-full px-3 py-2;
  }
  </style>
  
  