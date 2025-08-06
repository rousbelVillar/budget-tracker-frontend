<template>
    <div class="bg-white p-6 rounded shadow mt-6" style="min-width: 49vw;">
      <h2 class="text-xl font-bold mb-4">Transactions</h2>
      <Message test-suite="no-transactions-message"  v-if="transactions.length === 0">No transactions yet.</Message>
      <DataTable :value="transactions" stripedRows paginator :rows="10" :rowsPerPageOptions="[5, 10, 20, 50]" tableStyle="min-width: 20rem">
        <Column field="type" header="Type">
            <template #body="slotProps">
              <Tag test-suite="type-tag" :value="slotProps.data.type" :severity="getTypeSeverity(slotProps.data)" ></Tag>
            </template>
        </Column>
        <Column field="category" header="Category"/>
        <Column field="description" header="Description"/>
        <Column field="amount" header="Amount" test-suite="amount-column" class="amount-column">
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
import {computed} from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { Message,Button, Tag, useConfirm} from 'primevue';
import { useToast } from "primevue/usetoast";
import { useTransactionStore } from '../store/Transactions';
import { formatCurrency, getTypeSeverity } from '../globals/globals';
import { useDashboardStore } from '../store/Dashboard';


const confirm = useConfirm()
const toast = useToast();
const store = useTransactionStore();
const transactions = computed(() => store.transactions);
const dashboardStore = useDashboardStore();


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
            await store.removeTransaction(id)
            .then(()=>{
              store.fetchTransactions(dashboardStore.selectedMonth);
              toast.add({ severity: 'info', summary: 'Confirmed', detail: 'Record deleted', life: 3000 });
            }).catch(()=>{
              toast.add({ severity: 'error', summary: 'Unable to delete', detail: 'Unable to delete transaction', life: 3000 });
            })
        },
        // reject: () => {
        //     toast.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
        // }
    });
};
  

  </script>
  