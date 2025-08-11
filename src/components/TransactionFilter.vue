<template>
  <Card class="p-3 w-full max-w-xs shadow-md rounded-xl">
    <template #title>
      <h3 class="text-base font-semibold text-gray-700">Filters</h3>
    </template>
    <template #content>
      <div class="space-y-3 text-sm text-gray-600">

        <!-- Date Range -->
        <div>
          <label class="block mb-1">Date</label>
          <Calendar
            v-model="filters.dateRange"
            selectionMode="range"
            dateFormat="yy-mm-dd"
            showIcon
            class="w-full"
            inputClass="text-sm px-2 py-1"
          />
        </div>

        <!-- Suggested Amounts with Radio Buttons -->
        <div>
          <label class="block mb-1">Amount</label>
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

        <!-- Category -->
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
import { Calendar, Card, RadioButton, MultiSelect, useToast } from 'primevue'
import { computed, onMounted, ref } from 'vue'
import { useCategorieStore } from '../store/Categories'
import { showToast } from '../globals/globals'
import { useTransactionStore } from '../store/Transactions';
import { Category } from '../interfaces/Category';
import { Filter } from '../interfaces/Filter';

const categoriesStore = useCategorieStore();
const transactionStore = useTransactionStore();
const toast = useToast()
const filters = ref({
  dateRange: null,
  selectedAmount: null,
  category: [],
})

const suggestedAmounts = [
  { label: '< $50', value: '<50' },
  { label: '$50 - $100', value: '50-100' },
  { label: '$100 - $500', value: '100-500' },
  { label: '> $500', value: '>500' },
]

const categories = computed(()=> categoriesStore.categories)

const filterCategories = async (event:any)=>{
  const categoryFilter : Category[] = event.value;
  const filter : Filter = {categories:categoryFilter.map((c:Category)=> c.name).join(",")}
  await transactionStore.fetchTransactions(filter)
    .catch(()=>{
    showToast(toast,"Unable to retrieve transactions","error");
    transactionStore.loading = false;
  }).finally(()=> transactionStore.loading = false)
}

onMounted(async ()=>{
  await categoriesStore.fetchCategories()
  .catch(()=>{
    showToast(toast,"Error getting category filters","error");
    categoriesStore.loading = false;
  }).finally(()=> categoriesStore.loading = false)
})



</script>
