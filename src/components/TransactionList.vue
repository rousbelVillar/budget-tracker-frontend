<template>
    <div class="bg-white p-6 rounded shadow mt-6" style="min-width: 49vw;">
      <h2 class="text-xl font-bold mb-4">Transactions</h2>
      <div v-if="store.transactions.length === 0">No transactions yet.</div>
      <DataTable :value="store.transactions" stripedRows paginator :rows="10" :rowsPerPageOptions="[5, 10, 20, 50]" tableStyle="min-width: 20rem">
        <Column field="type" header="Type">
            <template #body="slotProps">
              <Tag :value="slotProps.data.type" :severity="getTypeSeverity(slotProps.data)"></Tag>
            </template>
        </Column>
        <Column field="category" header="Category"/>
        <Column field="description" header="Description"/>
        <Column field="amount" header="Amount">
            <template #body="slotProps">
              {{ formatCurrency(slotProps.data.amount) }}
            </template>
        </Column>
        <Column field="date" header="Date" style="width: 25%;"/>
        <Column>
          <template #body="slotProps">
            <Button class="mt-2 ml-1 float-right" test-suite="cancel-new-category" label="Remove" size="small" variant="outlined"  @click="confirmDeletion(slotProps.data.id)" severity="danger"/>
          </template>
        </Column>
      </DataTable>
    </div>
  </template>
  <script lang="ts" setup>
import {onMounted} from 'vue';
import API from '../api';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { Button, Tag, useConfirm} from 'primevue';
import { useToast } from "primevue/usetoast";
import { useTransactionStore } from '../store/Transactions';


const confirm = useConfirm()
const toast = useToast();
const store = useTransactionStore()
const props = defineProps<{month: string}>();  

// const fetchTransactions = async() => {
//     try {
//         const res = await API.get('/transactions', {params: { month: props.month }})
//         transactions.value = res.data.map((t: any)=>{
//           const non_formated_date = new Date(t.date);
//           const date = non_formated_date.getDate();
//           const month = non_formated_date.getMonth() +1;
//           const year = non_formated_date.getFullYear();
//           t.date = month + '-' + date + '-' + year;
//           return t;
//         });
//     } catch (err) {
//       console.error(err)
//     }
// }

  const formatCurrency = (value:any) => {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  };

  const getTypeSeverity = (transaction:any)=>{
      switch(transaction.type){
        case 'expense':
          return 'warn';
        case 'income':
          return 'success'
        default :
        return ''
      }
  }

  const confirmDeletion = (id:number) => {
    confirm.require({
        message: 'Do you want to remove this transaction?',
        header: 'Remove transaction',
        icon: 'pi pi-info-circle',
        rejectLabel: 'Cancel',
        rejectProps: {
            label: 'Cancel',
            severity: 'secondary',
            outlined: true
        },
        acceptProps: {
            label: 'Delete',
            severity: 'danger'
        },
        accept: async ()  => {
         try {
          await API.delete(`/transactions/${id}`)
          store.fetchTransactions(props.month);
          toast.add({ severity: 'info', summary: 'Confirmed', detail: 'Record deleted', life: 3000 });
          } catch (err) {
            toast.add({ severity: 'error', summary: 'Unable to delete', detail: 'Unable to delete transaction', life: 3000 });
            console.error(err)
          }
        },
        // reject: () => {
        //     toast.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
        // }
    });
};
  
  onMounted(() => {
    store.fetchTransactions(props.month)
  })

  defineExpose({
    //fetchTransactions
  })

  </script>
  