<template>
  <form
    @submit.prevent="submitTransaction"
    class="space-y-4 bg-white p-6 rounded shadow"
  >
    <div>
      <label class="block">Type</label>
      <select v-model="form.type" class="input" required>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>
    </div>    
    
    <div>
      <label class="block">Amount</label>
      <input v-model.number="form.amount" type="number" class="input" required />
    </div>


    <div>
      <label>Category:</label>
      <select v-model="form.category" class="input" placeholder="Default">
        <option disabled value="">Select a category</option>
        <option
          v-for="cat in categories"
          :key="cat.name"
          :value="cat.name"
        >
          {{ cat.icon }} {{ cat.name }}
        </option>
      </select>

      <div>
        <button type="button" class="text-blue-600 underline" @click="show_add_category =!show_add_category">
          + Add New Category
        </button>
      </div>

      <div v-if="show_add_category" class="flex gap-2 items-center">
        <input v-model="new_category.name" placeholder="Category name" class="input" />
        <Button label="Add"  @click="addCategory"severity="success" :disabled="!new_category.name"/>
      </div>
      </div>

    <div>
      <label class="block">Description</label>
      <input v-model="form.description" type="text" class="input" />
    </div>

    <button
      type="submit"
      class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
    >
      Add Transaction
    </button>
  </form>
</template>

<script lang="ts" setup>

import Button from 'primevue/button';
import { reactive, ref, onMounted } from 'vue';
import API from "../api";

interface TransactionFormData{
  type: "income" | "expense";
  category:string;
  description: string;
  amount:number;
};

interface Category{
  name: string;
  icon: string;
  is_default: boolean;
};

const categories = ref<Category[]>([]);
const show_add_category = ref(false);
const new_category = reactive<Category>({
    name: "",
    icon: "📝",
    is_default: false
});

const form = reactive<TransactionFormData>({
  type: "expense",
  amount:0,
  description:'',
  category: ""
});

  const  addCategory =  async () => {
        try {
        const res = await API.post('/categories/add', new_category)
          show_add_category= false;
          categories.push(res.data);
          new_category = "";
        } catch (error) {
          console.error(error);
        }
      }

  const submitTransaction = async () => {
        if (!form.category) {
          console.log("selected category",form.category)
          alert('Please select or enter a category.');
          return;
        }

        try {
          await API.post("/transactions/add", form);
          form.amount = "";
          form.category = "";
          form.description = "";
          form.category = "";

        } catch (err) {
          console.error(err);
          alert("Error adding transaction.");
        }
    }

  const fetchCategories = async() => {
        const res = await API.get('/categories')
        categories.value = res.data;
  }

  onMounted(() => {
    fetchCategories()
  })
</script>


<style scoped>
.input {
  @apply border border-gray-300 rounded w-full px-3 py-2;
}
</style>
