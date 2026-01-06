<template>
  <Card class="p-3 w-full max-w-xs shadow-md rounded-xl">
    <template #title>
      <h3 class="text-base font-semibold text-gray-700">Filters</h3>
    </template>
    <template #content>
      <div class="space-y-3 text-sm text-gray-600">
        <div>
          <label class="font-bold block mb-2">Amount</label>
          <div class="flex flex-col gap-1">
            <div v-for="amount in suggestedAmounts" :key="amount.value" class="flex items-center">
              <RadioButton 
                v-model="filters.selectedAmount"
                :inputId="amount.value"
                :value="amount.value"
                class="mr-2"
              />
              <label :for="amount.value" class="text-sm">{{ amount.label }}</label>
            </div>
          </div>
        </div>

        <div class="flex-auto">
            <label for="buttondisplay" class="font-bold block mb-2"> Date Range </label>
            <DatePicker v-model="dateRange" showIcon fluid :showOnFocus="false" :hideOnRangeSelection="true"  inputId="daterange" selectionMode="range" :manualInput="false" dateFormat="yy-mm-dd" @hide="handleDateRange()"/>
        </div>

        <div>
          <label class="block mb-1">Category</label>
          <div class="card flex justify-center">
              <MultiSelect 
                  v-model="filters.category" 
                  :options="categories" 
                  optionLabel="optionAndIcon" 
                  filter 
                  @change="filterCategories($event)"
                  placeholder="Select Categories"
                  display="chip"
                  :maxSelectedLabels="3" 
                  class="w-full md:w-80"             
                  inputClass="text-sm px-2 py-1"
                  panelClass="text-sm"/>
          </div>
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { Card, RadioButton, MultiSelect, useToast, DatePicker } from 'primevue'
import { computed, onMounted, ref } from 'vue'
import { useCategorieStore } from '../store/Categories'
import { formatDateYYMMDD, showToast } from '../globals/globals'
import { useTransactionStore } from '../store/Transactions';
import { Category } from '../interfaces/Category';
import { Q } from 'vitest/dist/chunks/reporters.d.C-cu31ET';

const categoriesStore = useCategorieStore();
const transactionStore = useTransactionStore();
const toast = useToast()
const filters = ref({
  dateRange: [],
  selectedAmount: null,
  category: [],
})

const suggestedAmounts = [
  { label: '< $50', value: '<50' },
  { label: '$50 - $100', value: '50-100' },
  { label: '$100 - $500', value: '100-500' },
  { label: '> $500', value: '>500' },
]

const categories = computed(()=> categoriesStore.categories);
const dateRange = ref();


const filterCategories = async (event:any)=>{
  const categoryEvent : Category[] = event.value;
  transactionStore.filters.categories = categoryEvent.map((c:Category)=> c.name).join(",");
  await transactionStore.fetchTransactions()
    .catch(()=>{
    showToast(toast,"Unable to retrieve transactions","error");
    transactionStore.loading = false;
  }).finally(()=> transactionStore.loading = false)
}

const handleDateRange = async () =>{
  if(dateRange.value && dateRange?.value[0] && dateRange?.value[1]){
    const start_date = new Date(dateRange.value[0])
    const end_date = new Date(dateRange.value[1])
    start_date.setMonth(start_date.getUTCMonth() +1);
    end_date.setMonth(end_date.getUTCMonth() +1);
    transactionStore.filters.start_date = formatDateYYMMDD(start_date);
    transactionStore.filters.end_date = formatDateYYMMDD(end_date);
    await transactionStore.fetchTransactions().catch(()=>{
    showToast(toast,"Unable to retrieve transactions","error");
      transactionStore.loading = false;
    }).finally(()=> transactionStore.loading = false);
  }
}

onMounted(async ()=>{
  await categoriesStore.fetchCategories()
  .catch(()=>{
    showToast(toast,"Error getting category filters","error");
    categoriesStore.loading = false;
  }).finally(()=> categoriesStore.loading = false)
})



</script>
