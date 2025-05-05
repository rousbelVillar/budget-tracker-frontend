<template>
    <div class="bg-white p-6 rounded shadow mt-6">
      <h2 class="text-xl font-bold mb-4">Summary</h2>
  
      <div class="grid grid-cols-3 gap-4 text-center">
        <div>
          <div class="text-sm text-gray-500">Income</div>
          <div class="text-green-600 font-bold text-lg">${{ income.toFixed(2) }}</div>
        </div>
        <div>
          <div class="text-sm text-gray-500">Expenses</div>
          <div class="text-red-600 font-bold text-lg">${{ expenses.toFixed(2) }}</div>
        </div>
        <div>
          <div class="text-sm text-gray-500">Balance</div>
          <div class="text-blue-600 font-bold text-lg">${{ (income - expenses).toFixed(2) }}</div>
        </div>
      </div>
  
      <div v-if="chartData && chartData.datasets[0].data.length" class="mt-8">
        <PieChart :chart-data="chartData" />
      </div>
      <div v-else class="mt-4 text-gray-500 text-sm text-center">No expense data to display chart.</div>
    </div>
  </template>
  
  <script>
  import API from '../api'
  import PieChart from './PieChart.vue'
  
  export default {
    components: { PieChart },
    data() {
      return {
        transactions: [],
      }
    },
    props: ['month'],
    computed: {
      income() {
        return this.transactions
          .filter(t => t.type === 'income')
          .reduce((sum, t) => sum + t.amount, 0)
      },
      expenses() {
        return this.transactions
          .filter(t => t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0)
      },
      chartData() {
        const grouped = {}
  
        this.transactions.forEach(t => {
          if (t.type === 'expense') {
            grouped[t.category] = (grouped[t.category] || 0) + t.amount
          }
        })
  
        const labels = Object.keys(grouped)
        const data = Object.values(grouped)
  
        return {
          labels,
          datasets: [
            {
              label: 'Expenses by Category',
              data,
              backgroundColor: ['#EF4444', '#F97316', '#FACC15', '#10B981', '#3B82F6', '#8B5CF6'],
            },
          ],
        }
      },
    },
    methods: {
      async fetchSummary() {
        try {
          const res = await API.get('/transactions', {
            params: { month: this.month }
          })
          const transactions = res.data
          // ... (same summary logic)
        } catch (err) {
          console.error('Failed to load summary', err)
        }
      },
},
mounted() {
  this.fetchSummary()
}

  }
  </script>
  