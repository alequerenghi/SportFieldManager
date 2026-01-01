<script setup>
import { onMounted, ref } from "vue";

const props = defineProps({ tournamentId: String, sport: String });
const results = ref(null);
const pointsCalled = ref("");

onMounted(async () => {
  const response = await fetch(
    `/api/tournaments/${props.tournamentId}/standings`
  );
  results.value = await response.json();
  pointsCalled.value = props.sport === "soccer" ? "Goals" : "Points";
});

x = {
  matchesPlayed: 0,
  matchesWon: 0,
  matchesLost: 0,
  setsWon: 0,
  setsLost: 0,
  gamesWon: 0,
  gamesLost: 0,
  points: 0,
};
</script>

<template>
  <div v-if="results">
    <table>
      <thead v-if="sport === 'tennis'">
        <th>Team name</th>
        <th>Points</th>
        <th>Matches played</th>
        <th>Sets won</th>
        <th>Sets lost</th>
        <th>Games won</th>
        <th>Matches won</th>
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
        <tr v-for="[team, result] of results">
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
        <tr v-for="[team, result] of results">
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
