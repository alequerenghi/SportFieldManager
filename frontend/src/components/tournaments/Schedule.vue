<script setup>
import { onMounted, ref } from "vue";
import { RouterLink, useRoute } from "vue-router";

const props = defineProps({
  tournament: { type: Object, required: true },
});

const route = useRoute();
const rounds = ref({});

onMounted(async () => {
  const response = await fetch(`/api/tournaments/${route.params.id}/matches`);
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
        <RouterLink :to="`/matches/${match._id}`" :tournament="tournament"
          >{{ match.teams[0] }} vs. {{ match.teams[1] }}</RouterLink
        >
      </li>
    </ul>
  </div>
</template>
