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
  <form @submit.prevent="submitScore" class="mt-3">
    <div class="mb-3">
      <label class="form-label fw-bold">Set scores</label>

      <div
        v-for="(_, i) in setScores"
        :key="i"
        class="row g-2 mb-2 align-items-center"
      >
        <div class="col-5">
          <input
            type="number"
            class="form-control form-control-sm"
            v-model.number="setScores[i][0]"
            placeholder="Team A"
            required
          />
        </div>

        <div class="col-2 text-center fw-bold">–</div>

        <div class="col-5">
          <input
            type="number"
            class="form-control form-control-sm"
            v-model.number="setScores[i][1]"
            placeholder="Team B"
            required
          />
        </div>
      </div>
    </div>

    <div class="d-flex gap-2">
      <button
        type="button"
        @click="setScores.push([0, 0])"
        class="btn btn-outline-primary btn-sm"
      >
        Add set
      </button>

      <button type="submit" class="btn btn-success btn-sm">Save result</button>
    </div>
  </form>
</template>
