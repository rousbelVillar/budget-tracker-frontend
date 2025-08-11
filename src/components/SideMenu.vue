
<template>
    <div class="card flex flex-col justify-center gap-3">
        <ProfileCard/>
        <Menu :model="items"></Menu>
        <TransactionFilter />
    </div>
</template>

<script lang="ts" setup>
import { Menu, useConfirm } from "primevue";
import { ref } from "vue";
import { useDialog } from 'primevue/usedialog';
import TransactionForm from "../components/TransactionForm.vue";
import { useAuthStore } from "../store/Auth";
import { useRouter } from "vue-router";
import TransactionFilter from "./TransactionFilter.vue";
import ProfileCard from "./ProfileCard.vue";

const dialog = useDialog();
const auth = useAuthStore();
const router = useRouter();
const confirm = useConfirm()



const items = ref([
    {
        label: 'Menu',
        items: [
            {
                label: 'New Transaction',
                icon: 'pi pi-plus',
                command: () => (showForm())       
            },
        ]
    },
    {
        items: [
            {
                label: 'Settings',
                icon: 'pi pi-cog'
            },
            {
                label: 'Logout',
                icon: 'pi pi-sign-out',
                command: ()=>(logout())
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
    });
}

const logout =()=>{
    confirm.require({
        message: 'Are you sure you want to logout?',
        header: 'Logging out',
        icon: 'pi pi-info-circle',
        rejectLabel: 'Cancel',
        rejectProps: {
            label: 'Cancel',
            severity: 'secondary',
            outlined: true
        },
        acceptProps: {
            label: 'Yes',
            severity: 'danger'
        },
        accept: async ()  => {
            auth.logout().then(()=> {
            router.push("/auth")
            });
        },

    });
}

</script>
