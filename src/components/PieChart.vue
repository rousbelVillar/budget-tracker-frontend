<template>
    <div>
      <Pie :data="chartData" />
    </div>
  </template>
  
  <script>
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
  
  export default {
    name: 'PieChart',
    components: { Pie },
    props: {
      chartData: Object,
    },
  }
  </script>
  