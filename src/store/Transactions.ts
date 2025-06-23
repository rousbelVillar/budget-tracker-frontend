import { defineStore } from 'pinia'
import { ref } from 'vue'
import API from '../api'
import { Transaction, TransactionForm } from '../interfaces/Transaction'
import { formatTransactionDate } from '../globals/globals';

export const useTransactionStore = defineStore('transactions', {
  state: () => ({
    transactions:[] as Transaction[],
    loading:false as boolean,
    error:"" as string | null
  }),
  actions: {
    async fetchTransactions (date: string) {
      this.loading = true
      this.error = null
      try {
        const res = await API.get('/transactions', {
          params: { month: date }
        })
          this.transactions = res.data.map((t: any)=>{
          t.date = formatTransactionDate(t.date)
          return t;
        });
      } catch (err: any) {
        this.error = err.message || 'Failed to load transactions'
      } finally {
        this.loading = false
      }
    },

    async addTransaction (data: TransactionForm) {
      try {
        await API.post('/transactions/add', data)
      } catch (err: any) {
        this.error = err.message || 'Failed to add transaction'
      }
    }
  }
})