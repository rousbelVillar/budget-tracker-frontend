import { defineStore } from "pinia";
import { ref } from "vue";
import API from "../api";
import { Transaction, TransactionForm } from "../interfaces/Transaction";
import { formatTransactionDate, getCookie } from "../globals/globals";

export const useTransactionStore = defineStore("transactions", {
  state: () => ({
    transactions: [] as Transaction[],
    loading: false as boolean,
    error: "" as string | null,
  }),
  actions: {
    async fetchTransactions(date: string) {
      this.loading = true;
      this.error = null;
      const csrfToken = getCookie("csrf_access_token");
      const res = await API.get("/transactions/get", {
        params: { month: date },
        headers: {
          "X-CSRF-TOKEN": csrfToken ?? "",
        },
      });
      this.transactions = res.data.map((t: any) => {
        t.date = formatTransactionDate(t.date);
        return t;
      });
    },

    async addTransaction(data: TransactionForm) {
      await API.post("/transactions/add", {
        params: data,
      });
    },
  },
});
