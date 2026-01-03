<script setup>
import { computed, onMounted, ref } from "vue";
import { RouterLink, useRoute } from "vue-router";
import Tennis from "./Tennis.vue";
import SportResult from "./SportResult.vue";
import { auth } from "@/stores/auth";
import router from "@/router";

const route = useRoute();
const tournament = ref(null);
const match = ref(null);
const canAddResults = ref(false);
const creator = computed(() => tournament.value.userId === auth._id);
const adding = ref(false);
const errorMessage = ref("");

const updateResult = async (data) => {
  errorMessage.value = "";
  data.sport = tournament.value.sport;
  const response = await fetch(`/api/matches/${route.params.id}/result`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });
  if (!response.ok) {
    errorMessage.value = await response.text();
  } else {
    await loadMatch();
  }
};

const loadMatch = async () => {
  errorMessage.value = "";
  const matchResponse = await fetch(`/api/matches/${route.params.id}`);
  match.value = await matchResponse.json();
  canAddResults.value =
    creator &&
    match.value.status === "upcoming" &&
    new Date(match.value.date) < new Date();
};

onMounted(async () => {
  await loadMatch();
  const response = await fetch(`/api/tournaments/${match.value.tournamentId}`);
  tournament.value = await response.json();
  await auth.fetchUser();
});
</script>

<template>
  <div v-if="match && tournament">
    <h1>{{ tournament.name }}</h1>
    <h2>
      <RouterLink :to="`/teams/${match.teams[0]._id}`">{{
        match.teams[0].name
      }}</RouterLink>
      vs.
      <RouterLink :to="`/teams/${match.teams[1]._id}`">
        {{ match.teams[1].name }}</RouterLink
      >
    </h2>
    <ul>
      <li>{{ new Date(match.date).toDateString() }}</li>
      <button v-if="canAddResults && !adding" @click="adding = true">
        Add results
      </button>
      <div v-if="canAddResults && adding">
        <Tennis v-if="tournament.sport === 'tennis'" @update="updateResult" />
        <SportResult v-else @update="updateResult" :match="match" />
      </div>
    </ul>
    <a @click="router.go(-1)">Back to schedule</a>
    <p>{{ errorMessage }}</p>
  </div>
</template>
