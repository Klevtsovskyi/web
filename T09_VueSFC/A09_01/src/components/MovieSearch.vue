<template>
  <div class="movie-search">
    <input type="text"
           ref="searchInput"
           :value="modelValue"
           placeholder="Введіть назву фільму Англійською"
           @input="$emit('update:modelValue', $event.target.value)"
    >
  </div>
</template>

<script setup>
import {ref, onMounted} from "vue";

defineProps({
  modelValue: String
})
defineEmits(["update:modelValue"]);
const searchInput = ref(null);

onMounted(() => {
  searchInput.value?.focus()
})


</script>

<style scoped>
.movie-search {
  margin-bottom: 2rem;
}

input {
  width: 100%;
  padding: 1rem;
  font-size: 1.1rem;
  border-radius: 10px;
  outline: none;
}
</style>