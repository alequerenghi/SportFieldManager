<script setup>
import { computed, onMounted, ref } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import Tennis from "./Tennis.vue";
import SportResult from "./SportResult.vue";
import { auth } from "@/stores/auth";

const route = useRoute();
const router = useRouter();
const tournament = ref(null);
const match = ref(null);
const creator = computed(() => {
  if (!tournament.value || !auth._id) {
    return false;
  }
  return tournament.value.userId === auth._id;
});
const adding = ref(false);
const errorMessage = ref("");
const canAddResults = computed(() => {
  if (!creator.value || !match.value) {
    return false;
  }
  return (
    match.value.status === "upcoming" && new Date(match.value.date) < new Date()
  );
});

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
    const { status } = response;
    const { error } = await response.json();
    errorMessage.value = `Error ${status}: ${error}`;
  } else {
    await loadMatch();
  }
};

const loadMatch = async () => {
  errorMessage.value = "";
  await auth.fetchUser();
  const matchResponse = await fetch(`/api/matches/${route.params.id}`);
  match.value = await matchResponse.json();
  const response = await fetch(`/api/tournaments/${match.value.tournamentId}`);
  tournament.value = await response.json();
};

onMounted(async () => await loadMatch());
</script>

<template>
  <div v-if="match && tournament" id="match" class="container mt-4">
    <h1 class="mb-3">{{ tournament.name }}</h1>

    <h4 class="mb-3">
      <RouterLink :to="`/teams/${match.teams[0]._id}`">
        {{ match.teams[0].name }}
      </RouterLink>
      vs.
      <RouterLink :to="`/teams/${match.teams[1]._id}`">
        {{ match.teams[1].name }}
      </RouterLink>
    </h4>

    <ul class="list-group list-group-flush mb-4">
      <li class="list-group-item">
        <strong>Date:</strong>
        {{ new Date(match.date).toDateString() }}
      </li>

      <li class="list-group-item">
        <strong>Status:</strong>
        <span
          class="badge ms-2"
          :class="
            match.status === 'completed' ? 'bg-success' : 'bg-warning text-dark'
          "
        >
          {{ match.status }}
        </span>
      </li>
    </ul>

    <div v-if="match.result" class="card mb-4">
      <div class="card-header">Match result</div>

      <div class="card-body">
        <!-- TENNIS -->
        <ul v-if="tournament.sport === 'tennis'" class="mb-0 list-unstyled">
          <li v-for="([home, away], index) in match.result" :key="index">
            {{ home }} – {{ away }}
          </li>
        </ul>

        <!-- OTHER SPORTS (if you add later) -->
        <p v-else class="mb-0">{{ match.result[0] }} – {{ match.result[1] }}</p>
      </div>
    </div>

    <div v-if="canAddResults" class="mb-4">
      <button
        v-if="!adding"
        @click="adding = true"
        class="btn btn-primary btn-sm"
      >
        Add results
      </button>

      <div v-if="adding" class="mt-3 p-3 border rounded">
        <Tennis
          v-if="tournament.sport === 'tennis'"
          @update="updateResult"
          :match="match"
        />
        <SportResult v-else @update="updateResult" :match="match" />
      </div>
    </div>

    <button @click="router.go(-1)" class="btn btn-secondary btn-sm">
      Back to schedule
    </button>

    <p v-if="errorMessage" class="alert alert-danger mt-3">
      {{ errorMessage }}
    </p>
  </div>
</template>

<style scoped>
#match {
  max-width: 650px;
}
</style>
