<script setup>
import { ref } from "vue";

const props = defineProps({
  match: { type: Object, required: true },
});
const emit = defineEmits(["update"]);

const setScores = ref([
  [0, 0],
  [0, 0],
  [0, 0],
]);

const submitScore = () => emit("update", { result: setScores.value });
</script>

<template>
  <form @submit.prevent="submitScore">
    <label>Set scores </label>
    <div v-for="(_, i) in setScores" :key="i">
      <input v-model="setScores[i][0]" required />
      <input v-model="setScores[i][1]" required />
    </div>
    <button type="submit">Save result</button>
  </form>
</template>
