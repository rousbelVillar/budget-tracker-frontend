<template>
    <div class="bg-white p-6 rounded shadow mt-6">
      <h2 class="text-xl font-bold mb-4">Summary</h2>
  
      <div class="grid grid-cols-3 gap-4">
        <div class="p-2">
          <div class="text-sm text-gray-500">Income</div>
           <Tag :value="`$${income().toFixed(2)}`" severity="success"/>
        </div>
        <div class="p-2">
          <div class="text-sm text-gray-500">Expenses</div>
          <Tag :value="`$${expenses().toFixed(2)}`" severity="danger"/>
        </div>
        <div class="p-2">
          <div class="text-sm text-gray-500">Balance</div>
          <Tag :value="`$${(income() - expenses()).toFixed(2)}`" severity="info"/>
        </div>
      </div>
  
      <div v-if="getChartData() && getChartData().datasets[0].data.length" class="mt-8">
        <PieChart :chartData="getChartData()" />
      </div>
      <div v-else class="mt-4 text-gray-500 text-sm text-center">No expense data to display chart.</div>
    </div>
  </template>
  
  <script lang="ts" setup>
import { ref, onMounted, computed} from 'vue';
import PieChart from './PieChart.vue'
import { ChartData } from 'chart.js';
import { useTransactionStore } from '../store/Transactions';
import { Tag } from 'primevue';

  const chartData = ref();
  const chartOptions = ref();  
  const transactionStore = useTransactionStore();
  const transactions = computed(() => transactionStore.transactions);

  
  onMounted(() => {
  chartData.value = getChartData();
  chartOptions.value = setChartOptions();
  });

  const income = ()=> {
        return transactions.value
          .filter(t => t.type === 'income')
          .reduce((sum, t) => sum + t.amount, 0)
  }
  const expenses = ()=> {
        return transactions.value
          .filter(t => t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0)
  }

  const getChartData = () => {
      const documentStyle = getComputedStyle(document.body);
          const grouped:any = {}
          transactionStore.transactions.forEach((t : any)=> {
            if (t.type === 'expense') {
              grouped[t.category] = (grouped[t.category] || 0) + t.amount
            }
          })
          const labels = Object.keys(grouped)
          const data: any = Object.values(grouped)
          const chartData:ChartData = {
          labels,
          datasets: [
              {
                  data,
                  backgroundColor: [documentStyle.getPropertyValue('--p-cyan-500'), documentStyle.getPropertyValue('--p-orange-500'), documentStyle.getPropertyValue('--p-gray-500'),'#EF4444', '#F97316', '#FACC15', '#10B981', '#3B82F6', '#8B5CF6'],
                  hoverBackgroundColor: [documentStyle.getPropertyValue('--p-cyan-400'), documentStyle.getPropertyValue('--p-orange-400'), documentStyle.getPropertyValue('--p-gray-400')]
              }
          ]
      }
      return chartData
  };

  const setChartOptions = () => {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--p-text-color');

      return {
          plugins: {
              legend: {
                  labels: {
                      usePointStyle: true,
                      color: textColor
                  }
              }
          }
      };
  };
  </script>
  