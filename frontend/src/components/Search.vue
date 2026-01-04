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
  <div class="container mt-4" id="home">
    <!-- Search -->
    <div class="card mb-4">
      <div class="card-body">
        <input
          v-model="searchBar"
          type="text"
          class="form-control"
          placeholder="Search fields, tournaments, teams, players"
        />
      </div>
    </div>

    <!-- Fields -->
    <div class="row">
      <div v-if="fields.length" class="col-md-6 col-lg-4">
        <div class="card mb-4">
          <div class="card-header">Fields</div>
          <ul class="list-group list-group-flush">
            <li
              v-for="field in fields"
              :key="field._id"
              class="list-group-item"
            >
              <RouterLink :to="`/fields/${field._id}`">
                {{ field.name }}
              </RouterLink>
            </li>
          </ul>
        </div>
      </div>

      <!-- Tournaments -->

      <div v-if="tournaments.length" class="col-md-6 col-lg-4">
        <div class="card mb-4">
          <div class="card-header">Tournaments</div>
          <ul class="list-group list-group-flush">
            <li
              v-for="tournament in tournaments"
              :key="tournament._id"
              class="list-group-item"
            >
              <RouterLink :to="`/tournaments/${tournament._id}`">
                {{ tournament.name }}
              </RouterLink>
            </li>
          </ul>
        </div>
      </div>

      <!-- Teams -->
      <div v-if="teams.length" class="col-md-6 col-lg-4">
        <div class="card mb-4">
          <div class="card-header">Teams</div>
          <ul class="list-group list-group-flush">
            <li v-for="team in teams" :key="team._id" class="list-group-item">
              <RouterLink :to="`/teams/${team._id}`">
                {{ team.name }}
              </RouterLink>
            </li>
          </ul>
        </div>
      </div>

      <!-- Players -->
      <div v-if="players.length" class="col-md-6 col-lg-4">
        <div class="card mb-4">
          <div class="card-header">Players</div>
          <ul class="list-group list-group-flush">
            <li
              v-for="player in players"
              :key="player._id"
              class="list-group-item"
            >
              <div class="fw-bold">{{ player.name }} {{ player.surname }}</div>
              <small class="text-muted">
                Team: {{ player.team }}
                <span v-if="player.jerseyNumber">
                  · Jersey #{{ player.jerseyNumber }}
                </span>
              </small>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <p
      v-if="
        !fields.length &&
        !tournaments.length &&
        !teams.length &&
        !players.length
      "
      class="text-muted text-center"
    >
      No results found
    </p>
  </div>
</template>
