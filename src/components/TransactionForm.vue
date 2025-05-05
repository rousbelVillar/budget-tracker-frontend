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
      <label class="block">Category</label>
      <input v-model="category" type="text" class="input" required />
    </div>

    <div>
      <label class="block">Description</label>
      <input v-model="description" type="text" class="input" />
    </div>

    <!-- <div>
      <label class="block">Date</label>
      <input v-model="date" type="date" class="input" />
    </div> -->

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
      //date: new Date().toISOString().split("T")[0],
    };
  },
  methods: {
    async submitTransaction() {
      console.log('amount',this.amount);
      console.log('type',this.type);
      console.log('category',this.category);
      console.log('description',this.description)
      try {
        await API.post("/transactions", {
          amount: this.amount,
          type: this.type,
          category: this.category,
          description: this.description,
          //date: this.date,
        });
        this.$emit("submitted");
        this.amount = "";
        this.category = "";
        this.description = "";
      } catch (err) {
        console.error(err);
        alert("Error adding transaction.");
      }
    },
  },
};
</script>

<style scoped>
.input {
  @apply border border-gray-300 rounded w-full px-3 py-2;
}
</style>
