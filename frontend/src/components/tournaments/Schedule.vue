<script setup>
import { onMounted, ref } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";

const tournament = ref(null);
const route = useRoute();
const router = useRouter();
const rounds = ref([]);
const errorMessage = ref("");

onMounted(async () => {
  const response = await fetch(`/api/tournaments/${route.params.id}`);
  if (response.ok) {
    tournament.value = await response.json();
    const matches = await fetch(`/api/tournaments/${route.params.id}/matches`);
    rounds.value = await matches.json();
  }
});
</script>

<template>
  <div v-if="tournament" id="schedule" class="container mt-4">
    <p v-if="errorMessage" class="alert alert-danger">
      {{ errorMessage }}
    </p>

    <h1 class="mb-4">{{ tournament.name }}</h1>

    <div v-for="round in rounds" :key="round.round" class="mb-4">
      <h3 class="mb-2">Round {{ round.round + 1 }}</h3>

      <ul class="list-group">
        <li
          v-for="match in round.matches"
          :key="match._id"
          class="list-group-item"
        >
          <RouterLink
            :to="`/matches/${match._id}`"
            class="text-decoration-none"
          >
            {{ match.teams[0] }} vs. {{ match.teams[1] }}
          </RouterLink>
        </li>
      </ul>
    </div>

    <RouterLink
      :to="`/tournaments/${route.params.id}`"
      class="btn btn-secondary"
    >
      Back to tournament info
    </RouterLink>
  </div>
</template>

<style scoped>
#schedule {
  max-width: 650px;
}
</style>
