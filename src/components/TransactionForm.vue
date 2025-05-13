<template>
  <form
    @submit.prevent="submitTransaction"
    class="space-y-4 bg-white p-6 rounded shadow"
  >
    <div>
      <label class="block">Type</label>
      <select v-model="type" class="input" required>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>
    </div>    
    
    <div>
      <label class="block">Amount</label>
      <input v-model.number="amount" type="number" class="input" required />
    </div>


    <div>
      <label>Category:</label>
      <select v-model="selectedDefaultCategory" class="input" placeholder="Default">
        <option disabled value="">Select a category</option>
        <option
          v-for="cat in defaultCategories"
          :key="cat.name"
          :value="cat"
        >
          {{ cat.icon }} {{ cat.name }}
        </option>
      </select>
      <div class="pt-3">
        <input v-model="selectedCustomCategory" type="text" class="input" placeholder="Custom"/>
      </div>
    </div>

    <div>
      <label class="block">Description</label>
      <input v-model="description" type="text" class="input" />
    </div>

    <button
      type="submit"
      class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
    >
      Add Transaction
    </button>
  </form>
</template>

<script>
import API from "../api";

export default {
  data() {
    return {
      amount: "",
      type: "expense",
      category: "",
      description: "",
      categoryInput: "",
      selectedDefaultCategory: "",
      selectedCustomCategory:"",
      defaultCategories: [],
      customCategories: []
    };
  },
  computed: {
    computedCategory() {
      return this.categoryMode === 'custom'
        ? { name: this.categoryInput.trim(), icon: '📝' }
        : this.selectedDefault;
    }
  },
  methods: {
    async addCustomCategory(category){
      try {
        await API.post('/categories',{
          id: category.id,
          name: category.name,
          icon: category.icon,
          is_default: category.is_default
        })
      } catch (error) {
        console.error(error);
      }
    },
    async submitTransaction() {
      if (!this.computedCategory?.name) {
        alert('Please select or enter a category.');
        return;
      }

      if(!this.computedCategory?.is_default){
        this.addCustomCategory(this.computedCategory)
      }

      try {
        await API.post("/transactions", {
          amount: this.amount,
          type: this.type,
          category: this.computedCategory.name,
          description: this.description,
        });

        this.$emit("submitted");
        this.amount = "";
        this.categoryInput = "";
        this.selectedDefault = "";
        this.description = "";
      } catch (err) {
        console.error(err);
        alert("Error adding transaction.");
      }
    },
    async fetchCategories(){
      const res = await API.get('/categories')
      this.defaultCategories = res.data.filter(cat=> cat.is_default);
      this.customCategories = res.data.filter(cat=> !cat.is_default);
    }
  },
  mounted(){
    this.fetchCategories();
  }
};
</script>


<style scoped>
.input {
  @apply border border-gray-300 rounded w-full px-3 py-2;
}
</style>
