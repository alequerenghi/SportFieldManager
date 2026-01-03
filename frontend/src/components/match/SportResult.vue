<script setup>
import { ref } from "vue";

const props = defineProps({
  match: { type: Object, required: true },
});

const emit = defineEmits(["update"]);

const home = ref(0);
const away = ref(0);

const sendData = () => emit("update", { result: [home.value, away.value] });
</script>

<template>
  <form @submit.prevent="sendData" class="mt-3">
    <div class="mb-3">
      <label class="form-label fw-bold">Team scores</label>
      <div class="row g-2 mb-2 align-items-center">
        <div class="col-5">
          <input
            type="number"
            v-model.number="home"
            class="form-control form-control-sm"
          />
        </div>
        <div class="col-2 text-center fw-bold">-</div>
        <div class="col-5">
          <input
            type="number"
            v-model.number="away"
            class="form-control form-control-sm"
          />
        </div>
      </div>
    </div>
    <div class="d-flex gap-2">
      <button type="submit" class="btn btn-outline-success btn-sm">
        Save result
      </button>
    </div>
  </form>
</template>
