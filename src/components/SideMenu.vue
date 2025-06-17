
<template>
    <div class="card flex justify-center">
        <Menu :model="items"></Menu>
    </div>
</template>

<script lang="ts" setup>
import { Menu } from "primevue";
import { defineAsyncComponent, ref } from "vue";
import { useDialog } from 'primevue/usedialog';
import TransactionForm from "../components/TransactionForm.vue";
const dialog = useDialog();
const dynamicComponent = defineAsyncComponent(() => import('../components/TransactionForm.vue'));

const items = ref([
    {
        label: 'Menu',
        items: [
            {
                label: 'New Transaction',
                icon: 'pi pi-plus',
                command: () => (showForm())       
            },
            {
                label: 'Filter',
                icon: 'pi pi-filter'
            }
        ]
    },
    {
        label: 'Profile',
        items: [
            {
                label: 'Settings',
                icon: 'pi pi-cog'
            },
            {
                label: 'Logout',
                icon: 'pi pi-sign-out'
            }
        ]
    }
]);

const showForm = () => {
    dialog.open(TransactionForm, {
        props: {
            header: 'New Transaction',
            style: {
                width: '25vw',
            },
            breakpoints:{
                '960px': '75vw',
                '640px': '90vw'
            },
            modal: true
        }
    });}
</script>
