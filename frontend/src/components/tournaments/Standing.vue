<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";

const props = defineProps({ sport: String });

const route = useRoute();
const results = ref(null);
const pointsCalled = ref("");

onMounted(async () => {
  const response = await fetch(`/api/tournaments/${route.params.id}/standings`);
  if (response.ok) {
    results.value = await response.json();
    pointsCalled.value = props.sport === "football" ? "Goals" : "Points";
  }
});
</script>

<template>
  <div v-if="results">
    <table>
      <thead v-if="props.sport === 'tennis'">
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
      <tbody v-if="props.sport === 'tennis'">
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
