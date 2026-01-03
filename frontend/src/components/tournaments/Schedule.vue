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
  <div v-if="tournament">
    <h1>{{ tournament.name }}</h1>
    <div v-for="round in rounds" :key="round.round">
      <h3>Round {{ round.round + 1 }}</h3>
      <ul>
        <li v-for="match in round.matches" :key="match._id">
          <RouterLink :to="`/matches/${match._id}`" :tournament="tournament"
            >{{ match.teams[0] }} vs. {{ match.teams[1] }}</RouterLink
          >
        </li>
      </ul>
      <p>{{ errorMessage }}</p>
    </div>
    <a @click="router.go(-1)">Back to tournament info</a>
  </div>
</template>
