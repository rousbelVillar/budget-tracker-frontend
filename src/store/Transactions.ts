import { defineStore } from "pinia";
import { ref } from "vue";
import API from "../api";
import { Transaction, TransactionForm } from "../interfaces/Transaction";
import { formatTransactionDate, getCookie } from "../globals/globals";
import { Filter } from "../interfaces/Filter";

export const useTransactionStore = defineStore("transactions", {
  state: () => ({
    transactions: [] as Transaction[],
    loading: false as boolean,
    error: "" as string | null,
  }),
  actions: {
    async fetchTransactions(filter: Filter) {
      const csrfToken = getCookie("csrf_access_token");
      this.loading = true;
      this.error = null;
      console.log(filter);
      const res = await API.get("/transactions/get", {
        params: { ...filter },
        headers: {
          "X-CSRF-TOKEN": csrfToken ?? "",
        },
      });
      this.transactions = res.data.map((t: any) => {
        t.date = formatTransactionDate(t.date);
        return t;
      });
      this.loading = false;
    },

    async addTransaction(transaction: TransactionForm) {
      const csrfToken = getCookie("csrf_access_token");
      await API.post(
        "/transactions/add",
        { params: transaction },
        {
          headers: {
            "X-CSRF-TOKEN": csrfToken ?? "",
          },
        }
      );
    },
    async removeTransaction(id: number) {
      const csrfToken = getCookie("csrf_access_token");
      await API.delete(`/transactions/${id}`, {
        headers: {
          "X-CSRF-TOKEN": csrfToken ?? "",
        },
      });
    },
  },
});
