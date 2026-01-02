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
  <form @submit.prevent="sendData">
    <label>{{ match.teams[0] }} goals:</label>
    <input type="number" v-model.number="home" />
    <label>{{ match.teams[1] }} goals:</label>
    <input type="number" v-model.number="away" />
    <button type="submit">Save result</button>
  </form>
</template>
