<script setup>
import { onMounted, ref, watch } from "vue";
import { searchSingle } from "./utils.js";

const fields = ref([]);
const tournaments = ref([]);
const teams = ref([]);
const players = ref([]);
const searchBar = ref("");
let debounce = null;

const search = async (val) => {
  try {
    fields.value = await searchSingle("fields", val);
    tournaments.value = await searchSingle("tournaments", val);
    teams.value = await searchSingle("teams", val);
    players.value = await searchSingle("players", val);
  } catch (err) {
    console.error(err);
  }
};

watch(searchBar, (val) => {
  clearTimeout(debounce);
  debounce = setTimeout(async () => await search(val), 400);
});

onMounted(async () => {
  await search("");
});
</script>

<template>
  <input placeholder="Search" v-model="searchBar" />
  <div>
    <h2 v-if="fields.length">Fields</h2>
    <ul>
      <li v-for="field in fields" :key="field.name">
        <RouterLink :to="`/fields/${field._id}`">{{ field.name }}</RouterLink>
      </li>
    </ul>
    <h2 v-if="tournaments.length">Tournaments</h2>
    <ul>
      <li v-for="tournament in tournaments" :key="tournament.name">
        <RouterLink :to="`/tournaments/${tournament._id}`">{{
          tournament.name
        }}</RouterLink>
      </li>
    </ul>
    <h2 v-if="teams.length">Teams</h2>
    <ul>
      <li v-for="team in teams" :key="team.name">
        <RouterLink :to="`/teams/${team._id}`">{{ team.name }}</RouterLink>
      </li>
    </ul>
    <h2 v-if="players.length">Players</h2>
    <ul>
      <li v-for="player in players" :key="player.surname">
        {{ player.name }} {{ player.surname }}, {{ player.team
        }}{{
          player.jerseyNumber ? ` with number: ${player.jerseyNumber}` : ""
        }}
      </li>
    </ul>
  </div>
</template>
