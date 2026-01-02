<script setup>
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import Tennis from "./Tennis.vue";
import SportResult from "./SportResult.vue";
import { auth } from "@/stores/auth";

const props = defineProps({
  tournament: { type: Object, required: true },
});

const route = useRoute();
const match = ref(null);
const canAddResults = ref(false);
const creator = computed(() => props.tournament.userId === auth._id);
const adding = ref(false);
const errorMessage = ref("");

const updateResult = async (data) => {
  errorMessage.value = "";
  data.sport = props.tournament.sport;
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
    new Date(match.value.date) > new Date();
};

onMounted(async () => {
  await loadMatch();
  await auth.fetchUser();
});
</script>

<template>
  <div v-if="match">
    <h1>{{ tournament.name }}</h1>
    <h2>{{ match.teams[0] }} vs. {{ match.teams[1] }}</h2>
    <ul>
      <li>{{ match.date }}</li>
      <button v-if="canAddResults && !adding" @click="adding = true">
        Add results
      </button>
      <div v-if="canAddResults && adding">
        <Tennis v-if="tournament.sport === 'tennis'" @update="updateResult" />
        <SportResult v-else @update="updateResult" />
      </div>
    </ul>
    <p>{{ errorMessage }}</p>
  </div>
</template>
