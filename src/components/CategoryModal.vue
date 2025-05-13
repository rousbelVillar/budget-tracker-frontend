<template>
  <div v-if="show" class="modal-overlay">
    <div class="modal-content">
      <h2>Select a Category</h2>
      <ul>
        <li
          v-for="cat in defaultCategories"
          :key="cat.name"
          @click="selectCategory(cat)"
        >
          {{ cat.icon }} {{ cat.name }}
        </li>
      </ul>
      <button @click="$emit('close')">Cancel</button>
    </div>
  </div>
</template>

<script setup>
import { defaultCategories } from '../data/categories'
const props = defineProps(['show'])
const emit = defineEmits(['select', 'close'])

const selectCategory = (cat) => emit('select', cat)
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 10px;
}
</style>
