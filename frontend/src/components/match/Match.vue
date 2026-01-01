<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import Tennis from "./Tennis.vue";
import SportResult from "./SportResult.vue";

const props = defineProps({
  tournament: { type: Object, required: true },
});

const route = useRoute();
const match = ref(null);
const creator = ref(false);

const updateResult = async (data) => {
  data.sport = props.tournament.sport;
  const response = await fetch(`/api/matches/${route.params.id}/result`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });
  if (!response.ok) {
    // TODO
  } else {
    await loadMatch();
  }
};

const loadMatch = async () => {
  const matchResponse = await fetch(`/matches/${route.params.id}`);
  match.value = await matchResponse.json();
};

onMounted(async () => {
  await loadMatch();
  const whoamiResposne = await fetch("/api/whoami", { credentials: "include" });
  const data = await whoamiResposne.json();
  creator.value = data._id === props.tournament.userId;
});
</script>

<template>
  <div v-if="match">
    <h1>{{ tournament.name }}</h1>
    <h2>{{ match.teams[0] }} vs. {{ match.teams[1] }}</h2>
    <ul>
      <li>{{ match.date }}</li>
      <button
        v-if="
          match.status === 'upcoming' &&
          creator &&
          new Date(match.startDate) > new Date()
        "
      >
        Add results
      </button>
      <div v-else>
        <Tennis v-if="tournament.sport === 'tennis'" @update="updateResult" />
        <SportResult v-else @update="updateResult" />
      </div>
    </ul>
  </div>
</template>
