<script setup>
import { ref } from "vue";

const props = defineProps({
  match: { type: Object, required: true },
});
const emit = defineEmits(["update"]);

const setScores = ref([
  [0, 0],
  [0, 0],
]);

const submitScore = () => {
  if (setScores.value.some(([a, b]) => a === b)) {
    alert("Sets cannot end in a draw");
    return;
  }
  emit("update", { result: setScores.value });
};
</script>

<template>
  <form @submit.prevent="submitScore">
    <label>Set scores </label>
    <div v-for="(_, i) in setScores" :key="i">
      <input type="number" v-model.number="setScores[i][0]" required />
      <input type="number" v-model.number="setScores[i][1]" required />
    </div>
    <button type="button" @click="setScores.push([0, 0])">Add set</button>
    <button type="submit">Save result</button>
  </form>
</template>
