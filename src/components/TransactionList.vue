<template>
    <div class="bg-white p-6 rounded shadow mt-6">
      <h2 class="text-xl font-bold mb-4">Transactions</h2>
      <div v-if="transactions.length === 0">No transactions yet.</div>
      <ul class="divide-y">
        <li v-for="t in transactions" :key="t.id" class="py-2 flex justify-between items-center">
          <div>
            <div class="font-semibold">{{ t.category }} ({{ t.type }})</div>
            <div class="text-sm text-gray-500">{{ t.date }} — {{ t.description }}</div>
          </div>
          <div class="flex gap-4 items-center">
            <span :class="t.type === 'income' ? 'text-green-600' : 'text-red-600'">
              ${{ t.amount.toFixed(2) }}
            </span>
            <button @click="deleteTransaction(t.id)" class="text-red-500 hover:underline">
              Delete
            </button>
          </div>
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  import API from '../api'
  
  export default {
    data() {
      return {
        transactions: [],
      }
    },
    props: ['month'],
    methods: {
      async fetchTransactions() {
        try {
            const res = await API.get('/transactions', {params: { month: this.month }})
            this.transactions = res.data;
        } catch (err) {
          console.error(err)
        }
      },
      async deleteTransaction(id) {
        if (!confirm('Are you sure?')) return
        try {
          await API.delete(`/transactions/${id}`)
          this.fetchTransactions()
        } catch (err) {
          console.error(err)
        }
      },
    },
    mounted() {
      this.fetchTransactions()
    },
  }
  </script>
  