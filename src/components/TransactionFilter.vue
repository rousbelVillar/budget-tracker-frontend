<template>
  <Card class="p-3 w-full max-w-xs shadow-md rounded-xl">
    <template #title>
      <h3 class="text-base font-semibold text-gray-700 mb-5">Filters</h3>
    </template>
    <template #content>
      <div class="space-y-3 text-sm text-gray-600">
        <div>
          <label class="flex font-bold mb-2">Amount</label>
          <div class="flex flex-col gap-1">
            <div v-for="amount in suggestedAmounts" :key="amount.label" class="flex items-center">
              <RadioButton 
                v-model="filters.max_amount"
                :inputId="amount.label"
                :value="amount.max"
                @change="filterAmount($event)"
                class="mr-2"
              />
              <label :for="amount.label" class="text-sm">{{ amount.label }}</label>
            </div>
          </div>
        </div>

        <div class="flex-auto">
            <label for="buttondisplay" class="font-bold flex mb-2"> Date Range </label>
            <DatePicker 
            class="flex" 
            v-model="dateRange" 
            showIcon
            fluid :showOnFocus="false" 
            :hideOnRangeSelection="true"  
            inputId="daterange" 
            selectionMode="range" 
            :manualInput="false" 
            dateFormat="yy-mm-dd" 
            @hide="handleDateRange()"
            />
        </div>

        <div >
          <label class="flex font-bold mb-2">Categories</label>
          <div class="card flex p-0">
              <MultiSelect 
                  v-model="filters.category" 
                  :options="categories" 
                  optionLabel="optionAndIcon" 
                  filter 
                  @change="filterCategories($event)"
                  placeholder="Select Categories"
                  display="chip"
                  :maxSelectedLabels="1" 
                  class="flex w-full md:w-80"             
                  inputClass="text-sm px-2 py-1"
                  panelClass="text-sm"/>
          </div>
          <Button class="relative right-[3vw] mt-3" label="Clear filter" icon="pi pi-refresh" severity="info" @click="clearFilter()"/>
        </div>

      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { Card, RadioButton, MultiSelect, useToast, DatePicker ,Button} from 'primevue'
import { computed, onMounted, ref } from 'vue'
import { useCategorieStore } from '../store/Categories'
import { formatDateYYMMDD, showToast } from '../globals/globals'
import { useTransactionStore } from '../store/Transactions';
import { Category } from '../interfaces/Category';

const categoriesStore = useCategorieStore();
const transactionStore = useTransactionStore();
const toast = useToast()
const filters = ref({
  dateRange: [],
  max_amount: null,
  category: [],
})

const suggestedAmounts = [
  { label: '< $50', max:50 },
  { label: '$50 - $100', max:100 },
  { label: '$100 - $500', max:500},
  { label: '> $500', max: 0 },
]

const categories = computed(()=> categoriesStore.categories);
const dateRange = ref();


const filterCategories = async (event:any)=>{
  if(!event.value.length){
    transactionStore.filters.categories = undefined
  }else{
    const categoryEvent : Category[] = event.value;
    transactionStore.filters.categories = categoryEvent.map((c:Category)=> c.name).join(",");
  }
  fetchTransactions();
}

const handleDateRange = async () =>{
  if(dateRange.value && dateRange?.value[0] && dateRange?.value[1]){
    const start_date = new Date(dateRange.value[0])
    const end_date = new Date(dateRange.value[1])
    start_date.setMonth(start_date.getUTCMonth() +1);
    end_date.setMonth(end_date.getUTCMonth() +1);
    transactionStore.filters.start_date = formatDateYYMMDD(start_date);
    transactionStore.filters.end_date = formatDateYYMMDD(end_date);
    fetchTransactions();
  }
}

const filterAmount = async (event:any)=>{
  transactionStore.filters.max_amount = event.target.value;
  fetchTransactions();
}

const clearFilter = ()=>{
  filters.value.dateRange = [];
  filters.value.category = [];
  filters.value.max_amount = null;
  dateRange.value = [];
  transactionStore.$reset();
  fetchTransactions()
}

const fetchTransactions = async ()=>{
    await transactionStore.fetchTransactions().catch(()=>{
    showToast(toast,"Unable to retrieve transactions","error");
      transactionStore.loading = false;
    }).finally(()=> transactionStore.loading = false);
}
onMounted(async ()=>{
  await categoriesStore.fetchCategories()
  .catch(()=>{
    showToast(toast,"Error getting category filters","error");
    categoriesStore.loading = false;
  }).finally(()=> categoriesStore.loading = false)
})



</script>
