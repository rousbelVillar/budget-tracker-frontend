<template>
  <Form :initialValues="form" @submit="submitTransaction" class="flex flex-col gap-4 w-full md:w-56">
    <FormField name="type" v-slot="$field">
      <label class="float-left" for="type">Type</label>
      <Select id="type" test-suite="select-type" v-model="form.type" :options="types" optionLabel="name" placeholder="Select a type" class="w-full md:w-56" />
    </FormField>
    <FormField name="category" v-slot="$field">
      <label class="float-left" for="category">Category</label>
      <Select id="category" test-suite="select-categories" v-model="form.category" :options="categories" optionLabel="optionAndIcon" placeholder="Select a category" class="w-full md:w-56" />
    </FormField>
    <FormField name="" v-slot="$field">
      <Button test-suite="add-new-category" severity="info" class="float-left" @click="show_add_category =!show_add_category">+ Add Category</Button>
    </FormField>
    <div v-if="!show_add_category">
      <FormField>
        <label class="float-left" for="new_category">Add New Category</label>
        <InputText test-suite="input-new-category" v-model="new_category.name" placeholder="Category name" fluid/>
        <Button class="mt-2 ml-1 float-right" test-suite="submit-new-category" label="Cancel"  @click="cancelAddCategory" severity="danger"/>
        <Button class="float-right mt-2" test-suite="submit-new-category" label="Add"  @click="addCategory" severity="success" :disabled="!new_category.name"/>
      </FormField>
    </div>
    <FormField name="amount" v-slot="$field">
      <label class="float-left" for="amount">Amount</label>
      <InputNumber test-suite="amount" v-model="form.amount" inputId="amount" :min="0" :max="2" mode="currency" currency="USD" locale="en-US" placeholder="Transaction amount" fluid />
    </FormField>
    <FormField name="description" v-slot="$field">
      <label class="float-left" for="type">Description</label>
      <InputText test-suite="input-description" v-model="form.description" inputId="description" fluid />
    </FormField>
    <FormField>
      <Button
        type="submit"
        severity="info"
        test-suite="transaction-submit"
      >
        Add Transaction
      </Button>
    </FormField>
  </Form>
</template>

<script lang="ts" setup>

import { reactive, ref, onMounted } from 'vue';
import { TransactionForm } from '../interfaces/Transaction';
import { Category } from '../interfaces/Category';
import API from '../api';
import { Form, FormField } from '@primevue/forms';
import {InputText, InputNumber, Select,Button, useToast } from 'primevue';

const categories = ref<Category[]>([]);
const show_add_category = ref(false);
const default_category = {name: "",icon: "📝",is_default: false}
const new_category = reactive<Category>(default_category);
const form = reactive<TransactionForm>({
  type: "expense",
  amount:0,
  description:'',
  category: ''
});

const types = ref([
    { name: 'Income', value: 'income' },
    { name: 'Expense', value: 'expense' },
]);
  const addCategory =  async () => {
        try {
        const res = await API.post('/categories/add', new_category)
          //show_add_category.value= false;
          categories.value.push(res.data);
          new_category.icon = default_category.icon;
          new_category.is_default = default_category.is_default;
          new_category.name = default_category.name;
          show_add_category.value = !show_add_category.value;
        } catch (error) {
          console.error(error);
        }
      }
  const cancelAddCategory = ()=>{
      new_category.name = '';
      show_add_category.value = !show_add_category.value;
  }

  const submitTransaction = async () => {
        if (!form.category) {
          alert('Please select or enter a category.');
          return;
        }

        try {
          await API.post("/transactions/add", form);
          // form.amount = 0;
          // form.category = default_category.name;
          // form.description = "";
        } catch (err) {
          console.error(err);
          alert("Error adding transaction.");
        }
    }

  const fetchCategories = async() => {
        const res = await API.get('/categories')
        categories.value = res.data.map((c:any)=>{
          const category : Category = {name:c.name,icon:c.icon,is_default:c.is_default,optionAndIcon:c.icon + " " + c.name}
          return category
        });
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
