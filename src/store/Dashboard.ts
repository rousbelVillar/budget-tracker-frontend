import { defineStore } from "pinia";

export const useDashboardStore = defineStore("dashboard", {
  state: () => ({
    selectedMonth: "" as string,
  }),
  actions: {
    setSelectedMonth(date: string) {
      this.selectedMonth = date;
    },
  },
});
