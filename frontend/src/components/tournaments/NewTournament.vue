<script setup>
import { onMounted, onUnmounted, ref, watch } from "vue";
import { searchSingle } from "../utils";

const name = ref("");
const maxTeams = ref(0);
const chosenField = ref("");
const fields = ref([]);
const fieldId = ref(null);
const startDate = ref("");
const showSuggestions = ref(false);
const message = ref("");
const sport = ref("");
let debounce = null;

watch(chosenField, (val) => {
  clearTimeout(debounce);
  if (!val) {
    fields.value = [];
    showSuggestions.value = false;
    return;
  }
  debounce = setTimeout(async () => {
    fields.value = await searchSingle("fields", val);
    showSuggestions.value = true;
  }, 400);
});

const selectField = (field) => {
  chosenField.value = field.name;
  fieldId.value = field._id;
  sport.value = field.sport;
  showSuggestions.value = false;
};

const createTournament = async () => {
  const tournament = {
    name: name.value,
    maxTeams: maxTeams.value,
    sport: sport.value,
    startDate: startDate.value,
    fieldId: fieldId.value,
  };
  const response = await fetch("/api/tournaments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(tournament),
    credentials: "include",
  });
  if (!response.ok) {
    const data = await response.json();
    const { error } = data;
    message.value = error;
  } else {
    const data = await response.text();
    message.value = data;
  }
};

const handleClickOutside = () => {
  showSuggestions.value = false;
};

onMounted(() => document.addEventListener("click", handleClickOutside));
onUnmounted(() => document.removeEventListener("click", handleClickOutside));
</script>

<template>
  <form @submit.prevent="createTournament">
    <input type="text" placeholder="Tournament name" v-model="name" required />
    <input type="number" placeholder="Max teams" v-model="maxTeams" required />
    <div @click.stop>
      <input type="text" placeholder="Field" v-model="chosenField" required />
      <ul v-if="showSuggestions && fields.length">
        <li v-for="field in fields" :key="field._id">
          <a @click.prevent="selectField(field)">
            {{ field.name }}
          </a>
        </li>
      </ul>
    </div>
    <input type="date" placeholder="Start date" v-model="startDate" required />
    <button type="submit">Create!</button>
  </form>
  <p>{{ message }}</p>
</template>
