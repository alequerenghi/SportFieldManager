<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const name = ref("");
const maxTeams = ref(5);
const startDate = ref("");
const errorMessage = ref("");
const sport = ref("");

const createTournament = async () => {
  const tournament = {
    name: name.value,
    maxTeams: maxTeams.value,
    sport: sport.value,
    startDate: startDate.value,
  };
  const response = await fetch("/api/tournaments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(tournament),
    credentials: "include",
  });
  if (!response.ok) {
    errorMessage.value = await response.text();
  } else {
    const data = await response.json();
    router.push(`/tournaments/${data}`);
  }
};
</script>

<template>
  <form @submit.prevent="createTournament">
    <input placeholder="Tournament name" v-model="name" required />
    <input
      type="number"
      placeholder="Max teams"
      v-model.number="maxTeams"
      required
    />
    <input placeholder="Sport" v-model="sport" required />
    <input type="date" placeholder="Start date" v-model="startDate" required />
    <button type="submit">Create!</button>
  </form>
  <p>{{ errorMessage }}</p>
</template>
