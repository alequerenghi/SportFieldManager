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
  <div v-if="results">
    <table>
      <thead v-if="sport === 'tennis'">
        <tr>
          <th>Team name</th>
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
          <th>Team name</th>
          <th>Score</th>
          <th>Mastches played</th>
          <th>{{ pointsCalled }} scored</th>
          <th>{{ pointsCalled }} conceded</th>
          <th>{{ pointsCalled }} difference</th>
        </tr>
      </thead>
      <tbody v-if="sport === 'tennis'">
        <tr v-for="[team, result] in results">
          <td>{{ team }}</td>
          <td>{{ result.points }}</td>
          <td>{{ result.matchesPlayed }}</td>
          <td>{{ result.setsWon }}</td>
          <td>{{ result.setsLost }}</td>
          <td>{{ result.gamesWon }}</td>
          <td>{{ result.matchesWon }}</td>
        </tr>
      </tbody>
      <tbody v-else>
        <tr v-for="[team, result] in results">
          <td>{{ team }}</td>
          <td>{{ result.score }}</td>
          <td>{{ result.matchesPlayed }}</td>
          <td>{{ result.goals[0] }}</td>
          <td>{{ result.goals[1] }}</td>
          <td>{{ result.goals[0] - result.goals[1] }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
