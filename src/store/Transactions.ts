import { defineStore } from 'pinia'
import { ref } from 'vue'
import API from '../api'
import { Transaction, TransactionForm } from '../interfaces/Transaction'

export const useTransactionStore = defineStore('transaction', () => {
  const transactions = ref<Transaction[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

    const fetchTransactions = async (date: string) => {
    loading.value = true
    error.value = null
    try {
      const res = await API.get('/transactions', {
        params: { month: date }
      })
      transactions.value = res.data.map((t: any)=>{
        const non_formated_date = new Date(t.date);
        const date = non_formated_date.getDate();
        const month = non_formated_date.getMonth() +1;
        const year = non_formated_date.getFullYear();
        t.date = month + '-' + date + '-' + year;
        return t;
      });
    } catch (err: any) {
      error.value = err.message || 'Failed to load transactions'
    } finally {
      loading.value = false
    }
  }

  const addTransaction = async (data: TransactionForm) => {
    try {
      const res = await API.post('/transactions/add', data)
      transactions.value.unshift(res.data) // or refetch all
    } catch (err: any) {
      error.value = err.message || 'Failed to add transaction'
    }
  }

  return {
    transactions,
    loading,
    error,
    fetchTransactions,
    addTransaction
  }
})
