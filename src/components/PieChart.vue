<template>
    <div>
      <Pie :data="props.chartData" />
    </div>
  </template>
  
  <script lang="ts" setup>
  import { Pie } from 'vue-chartjs'
  import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    CategoryScale,
  } from 'chart.js'
  
  ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale)

  const props = defineProps<{chartData:any}>();    
  </script>
  