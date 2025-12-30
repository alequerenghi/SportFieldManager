<script setup>
import { onMounted, ref } from "vue";

const props = defineProps({ tournamentId: { type: String, required: true } });

const rounds = ref({});

onMounted(async () => {
  const response = await fetch(
    `/api/tournaments/${props.tournamentId}/matches`
  );
  if (!response.ok) {
    await response.text();
  } else {
    rounds.value = await response.json();
  }
});
</script>

<template>
  <div v-for="round in rounds" :key="round.round">
    <h3>Round {{ round.round + 1 }}</h3>
    <ul>
      <li v-for="match in round.matches">
        <a>{{ match.teams[0] }} vs. {{ match.teams[1] }}</a>
      </li>
    </ul>
  </div>
</template>
