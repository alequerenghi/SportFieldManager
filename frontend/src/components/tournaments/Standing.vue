<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const results = ref(null);
const pointsCalled = ref("");
const sport = ref("");

onMounted(async () => {
  const response = await fetch(`/api/tournaments/${route.params.id}`);
  if (response.ok) {
    const tournament = await response.json();
    sport.value = tournament.sport;
    pointsCalled.value = sport.value === "football" ? "Goals" : "Points";
    const standing = await fetch(
      `/api/tournaments/${route.params.id}/standings`
    );
    results.value = await standing.json();
  }
});
</script>

<template>
  <div v-if="results" id="standing" class="container mt-4">
    <table class="table table-dark table-hover">
      <thead v-if="sport === 'tennis'">
        <tr>
          <th scope="col">Team name</th>
          <th>Points</th>
          <th>Matches played</th>
          <th>Sets won</th>
          <th>Sets lost</th>
          <th>Games won</th>
          <th>Matches won</th>
        </tr>
      </thead>

      <thead v-else>
        <tr>
          <th scope="col">Team name</th>
          <th scope="col">Score</th>
          <th scope="col">Matches played</th>
          <th scope="col">{{ pointsCalled }} scored</th>
          <th scope="col">{{ pointsCalled }} conceded</th>
          <th scope="col">{{ pointsCalled }} difference</th>
        </tr>
      </thead>

      <tbody v-if="sport === 'tennis'">
        <tr v-for="[team, result] in results" :key="team">
          <th scope="row">{{ team }}</th>
          <td>{{ result.points }}</td>
          <td>{{ result.matchesPlayed }}</td>
          <td>{{ result.setsWon }}</td>
          <td>{{ result.setsLost }}</td>
          <td>{{ result.gamesWon }}</td>
          <td>{{ result.matchesWon }}</td>
        </tr>
      </tbody>

      <tbody v-else>
        <tr v-for="[team, result] in results" :key="team">
          <th scope="row">{{ team }}</th>
          <td>{{ result.score }}</td>
          <td>{{ result.matchesPlayed }}</td>
          <td>{{ result.goals[0] }}</td>
          <td>{{ result.goals[1] }}</td>
          <td>{{ result.goals[0] - result.goals[1] }}</td>
        </tr>
      </tbody>
    </table>

    <RouterLink
      :to="`/tournaments/${route.params.id}`"
      class="btn btn-secondary"
    >
      Back to tournament
    </RouterLink>
  </div>
</template>

<style scoped>
#standing {
  max-width: 650px;
}
</style>
