<script setup>
import { auth } from "@/stores/auth";
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const creator = computed(() => auth._id === team.value.creatorId);
const adding = ref(false);
const name = ref("");
const surname = ref("");
const jerseyNumber = ref(null);
const team = ref(null);
const errorMessage = ref("");

const addPlayer = () => {
  const newPlayer = {
    name: name.value,
    surname: surname.value,
    jerseyNumber: jerseyNumber.value,
  };
  team.value.players.push(newPlayer);
  name.value = "";
  surname.value = "";
  jerseyNumber.value = null;
};

const registerNewPlayers = async () => {
  const response = await fetch(`/api/teams/${route.params.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(team.value.players),
    credentials: "include",
  });
  if (!response.ok) {
    errorMessage.value = await response.text();
  } else {
    await loadTeam();
  }
};

const loadTeam = async () => {
  const response = await fetch(`/api/teams/${route.params.id}`);
  team.value = await response.json();
};

onMounted(async () => {
  await loadTeam();
  await auth.fetchUser();
});
</script>

<template>
  <div v-if="team">
    <h1>{{ team.name }}</h1>
    <form v-if="creator && adding" @submit.prevent="registerNewPlayers">
      <input placeholder="Name" v-model="name" required />
      <input placeholder="Surname" v-model="surname" required />
      <input type="number" v-model="jerseyNumber" />
      <button type="button" @click="addPlayer">Add player</button>
    </form>
    <ul>
      <li v-for="(player, index) in team.players" :key="index">
        {{ player.name }} {{ player.surname }}
        {{ player.jerseyNumber ? `with number: ${player.jerseyNumber}` : "" }}
      </li>
    </ul>
    <button v-if="creator && !adding" type="submit" @click="adding = true">
      Add new players
    </button>
    <p>{{ errorMessage }}</p>
  </div>
</template>
