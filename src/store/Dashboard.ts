import { defineStore } from "pinia";

const now: Date = new Date();

export const useDashboardStore = defineStore("dashboard", {
  state: () => ({
    selectedStartMonth:
      `${now.getUTCFullYear()}-${now.getUTCMonth()}-${now.getUTCDate()}` as string,
    selectedEndMonth: `${now.getUTCFullYear()}-${
      now.getUTCMonth() + 1
    }-${now.getUTCDate()}` as string,
  }),
});
