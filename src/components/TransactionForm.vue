<template>
  <div>
    <Form ref="formRef" :validateOnValueUpdate="true" :validateOnBlur="true" v-slot="$form" :resolver="transactionFormResolver" @submit="submitTransaction" class="flex flex-col gap-4 w-full md:w-56">
      <FormField name="type" initial-value="">
        <label class="float-left" for="type">Type</label>
        <Select 
          id="type" 
          test-suite="select-type" 
          name="type" 
          v-model="form.type" 
          :options="types" 
          optionLabel="name" 
          option-value="value" 
          placeholder="Select a type" 
          class="w-full md:w-56" />

        <Message v-if="$form.type?.invalid" severity="error" size="small" variant="simple">{{ $form.type.errors }}</Message>
      </FormField>
      <FormField name="category">
        <label class="float-left" for="category">Category</label>
        <Select name="category" id="category" test-suite="select-categories" v-model="form.category" :options="categories" optionLabel="optionAndIcon" option-value="name" placeholder="Select a category" class="w-full md:w-56" />
        <Message v-if="$form.category?.invalid" severity="error" size="small" variant="simple">{{ $form.category.errors }}</Message>
      </FormField>
      <FormField>
        <Button test-suite="add-new-category" severity="info" class="float-left" @click="show_add_category =!show_add_category">+ Add Category</Button>
      </FormField>
      <div v-if="!show_add_category">
        <FormField>
          <label class="float-left" for="new_category">Add New Category</label>
          <InputText test-suite="input-new-category" v-model="new_category.name" placeholder="Category name"  fluid/>
          <Button class="mt-2 ml-1 float-right" test-suite="cancel-new-category" label="Cancel"  @click="cancelAddCategory" severity="danger"/>
          <Button class="float-right mt-2" test-suite="submit-new-category" label="Add"  @click="addCategory" severity="success" :disabled="!new_category.name"/>
        </FormField>
      </div>
      <FormField name="amount">
        <label class="float-left" for="amount">Amount</label>
        <InputNumber name="amount" test-suite="amount" v-model="form.amount" inputId="amount" mode="currency" currency="USD" locale="en-US" v-keyfilter.money fluid placeholder="Transaction amount" />
        <Message v-if="$form.amount?.invalid" severity="error" size="small" variant="simple">{{ $form.amount.errors }}</Message>
      </FormField>
      <FormField name="description">
        <label class="float-left" for="type">Description</label>
        <InputText test-suite="input-description" v-model="form.description" inputId="description" name="description" fluid />
        <Message v-if="$form.description?.invalid" severity="error" size="small" variant="simple">{{ $form.description.errors }}</Message>
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
  </div>
</template>

<script lang="ts" setup>

import { reactive, ref, onMounted, computed } from 'vue';
import { TransactionForm } from '../interfaces/Transaction';
import { Category } from '../interfaces/Category';
import { Form, FormField} from '@primevue/forms';
import {InputText, InputNumber, Select,Button, Message, useToast} from 'primevue';
import { mockTransactionResolver, transactionFormResolver } from '../validation/resolvers';
import { inject } from "vue";
import { useTransactionStore } from '../store/Transactions';
import { useDashboardStore } from '../store/Dashboard';
import { useCategorieStore } from '../store/Categories';
import { showToast } from '../globals/globals';


  const categoriesStore = useCategorieStore()
  const categories = computed(()=> categoriesStore.categories);
  const show_add_category = ref(true);
  const default_category = {name: "",icon: "📝",is_default: false}
  const new_category = reactive<Category>(default_category);
  const formRef = ref();
  const form = reactive<TransactionForm>({
    type: "",
    amount:0,
    description:'',
    category: '',
  });

  const types = ref([
      { name: 'Income', value: 'income' },
      { name: 'Expense', value: 'expense' },
  ]);
  const toast = useToast();
  const dialogRef:any = inject('dialogRef');
  const transactionStore = useTransactionStore()
  const dashboardStore = useDashboardStore()


  const addCategory =  async () => {
      await categoriesStore.addCategory(new_category).then(async ()=>{
          new_category.icon = default_category.icon;
          new_category.is_default = default_category.is_default;
          new_category.name = default_category.name;
          show_add_category.value = !show_add_category.value;
          showToast(toast,'Cattegory submitted successfully.');
      })
      .catch((e:any)=>{
          showToast(toast, e.response.data.error || 'Error adding category.', 'error');
      })
      await categoriesStore.fetchCategories()
      .catch((e:any)=>{
          showToast(toast, e.response.data.error || 'Error updating categories.', 'error');
      }).finally(()=>{
          categoriesStore.loading = false;
      });  
  }
  
  const cancelAddCategory = ()=>{
      new_category.name = '';
      show_add_category.value = !show_add_category.value;
  }

  const submitTransaction = async () => {
    const result = await formRef.value?.validate();
      if(Object.keys(result.errors).length === 0 || mockTransactionResolver(form)){
        await transactionStore.addTransaction(form).
        then(()=>{
          showToast(toast,'Transaction submitted successfully.');
          closeDialog();
        })
        .catch((e:any)=>{
          showToast(toast,e.response.data.error || 'Error adding transaction.','error')
        })
        await transactionStore.fetchTransactions(dashboardStore.selectedMonth)
        .catch((e:any)=>{
          showToast(toast,e.response.data.error || 'Error retrieving transactions.','error')
        })
    }
  }

  const closeDialog = () => {
    dialogRef.value.close();
  }

  onMounted( async ()  => {
     await categoriesStore.fetchCategories().then(console.log)
  })

</script>


<style scoped>
.input {
  @apply border border-gray-300 rounded w-full px-3 py-2;
}
</style>
