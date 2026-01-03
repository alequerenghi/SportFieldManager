<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import { searchSingle } from "../utils";
import { auth } from "@/stores/auth";

const router = useRouter();
const route = useRoute();
const isCreator = computed(() => auth._id === tournament.value.userId);
const creatorData = ref(null);
const errorMessage = ref("");
const modifying = ref("no");
const newTeam = ref("");
const newMaxTeams = ref(0);
const newTeamName = ref("");
const tournament = ref(null);
const showSuggestions = ref(false);
const suggestedTeams = ref([]);
let debounce = null;

const deleteTournament = async () => {
  errorMessage.value = "";
  const response = await fetch(`/api/tournaments/${route.params.id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!response.ok) {
    const { error } = await response.json();
    errorMessage.value = error;
  }
  router.push("/");
};

const updateTournamentInfo = async () => {
  errorMessage.value = "";
  const teams = tournament.value.teams.map((t) => t._id);
  const payload = {
    teams,
    maxTeams: newMaxTeams.value,
  };
  if (newTeamName.value.length < 3) {
    payload.name = tournament.value.name;
  } else {
    payload.name = newTeamName.value;
  }
  const response = await fetch(`/api/tournaments/${route.params.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    credentials: "include",
  });
  if (!response.ok) {
    const { error } = await response.json();
    errorMessage.value = error;
  } else {
    await loadTournament();
  }
  modifying.value = "no";
};

const generate = async () => {
  errorMessage.value = "";
  const response = await fetch(
    `/api/tournaments/${route.params.id}/matches/generate`,
    {
      method: "POST",
      credentials: "include",
    }
  );
  if (!response.ok) {
    const { error } = await response.json();
    errorMessage.value = error;
  }
  router.push(`/tournaments/${route.params.id}/schedule`);
};

const loadTournament = async () => {
  errorMessage.value = "";
  const response = await fetch(`/api/tournaments/${route.params.id}`, {
    credentials: "include",
  });
  tournament.value = await response.json();
};

const addTeam = (team) => {
  tournament.value.teams.push(team);
  newTeam.value = "";
  showSuggestions.value = false;
};

watch(newTeam, (val) => {
  clearTimeout(debounce);
  if (!val) {
    suggestedTeams.value = [];
    showSuggestions.value = false;
    return;
  }
  debounce = setTimeout(async () => {
    suggestedTeams.value = await searchSingle("teams", val);
    showSuggestions.value = true;
  }, 400);
});

onMounted(async () => {
  await loadTournament();
  const { maxTeams, userId } = tournament.value;
  newMaxTeams.value = maxTeams;
  await auth.fetchUser();

  const creatorResponse = await fetch(`/api/users/${userId}`);
  const { user } = await creatorResponse.json();
  creatorData.value = user;
});

const handleClickOutside = () => (showSuggestions.value = false);

onMounted(() => document.addEventListener("click", handleClickOutside));
onUnmounted(() => document.removeEventListener("click", handleClickOutside));
</script>

<template>
  <div v-if="tournament" id="tournament-info" class="container mt-4">
    <h1 class="mb-3">{{ tournament.name }}</h1>
    <p v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</p>

    <ul class="list-unstyled mb-4">
      <li><strong>Sport: </strong> {{ tournament.sport }}</li>
      <li><strong>Max teams: </strong> {{ tournament.maxTeams }}</li>

      <li v-if="creatorData">
        <strong>Created by: </strong>
        <RouterLink :to="`/users/${creatorData._id}`">
          {{ creatorData.username }}
        </RouterLink>
      </li>

      <li>
        <strong>Start date:</strong>
        {{ new Date(tournament.startDate).toDateString() }}
      </li>

      <li v-if="tournament.schedule" class="mt-2">
        <RouterLink
          class="btn btn-outline-info btn-sm"
          :to="`/tournaments/${route.params.id}/schedule`"
        >
          View schedule
        </RouterLink>
      </li>
      <li v-if="tournament.teams.length" class="mt-2">
        <strong>Teams:</strong>
      </li>
      <ul class="ps-3">
        <li v-for="team in tournament.teams" :key="team._id">
          <RouterLink :to="`/teams/${team._id}`">
            {{ team.name }}
          </RouterLink>
        </li>
      </ul>
    </ul>

    <!-- ADD TEAM FORM -->
    <form
      v-if="modifying === 'teams'"
      @submit.prevent="updateTournamentInfo"
      class="mb-4"
    >
      <div class="row mb-3">
        <label class="col-sm-3 col-form-label">Team name</label>
        <div class="col-sm-9">
          <input
            v-if="tournament.teams.length <= tournament.maxTeams"
            v-model="newTeam"
            class="form-control"
            placeholder="Search team"
          />
        </div>
      </div>

      <ul v-if="showSuggestions" class="list-group mb-3">
        <li
          v-for="team in suggestedTeams"
          :key="team._id"
          class="list-group-item list-group-item-action"
          @click="addTeam(team)"
        >
          {{ team.name }}
        </li>
      </ul>

      <button type="submit" class="btn btn-primary">Save</button>
    </form>

    <!-- EDIT INFO FORM -->
    <form
      v-else-if="modifying === 'info'"
      @submit.prevent="updateTournamentInfo"
      class="mb-4"
    >
      <div class="row mb-3">
        <label class="col-sm-3 col-form-label">Tournament name</label>
        <div class="col-sm-9">
          <input
            type="text"
            v-model="newTeamName"
            class="form-control"
            placeholder="New tournament name"
          />
        </div>
      </div>

      <div class="row mb-3">
        <label class="col-sm-3 col-form-label">Max teams</label>
        <div class="col-sm-9">
          <input
            type="number"
            v-model.number="newMaxTeams"
            class="form-control"
          />
        </div>
      </div>

      <button type="submit" class="btn btn-primary">Save changes</button>
    </form>

    <!-- CREATOR ACTIONS -->
    <div v-if="isCreator" class="btn-group mb-3">
      <button class="btn btn-outline-primary" @click="modifying = 'info'">
        Edit info
      </button>
      <button class="btn btn-outline-success" @click="modifying = 'teams'">
        Add team
      </button>
      <button class="btn btn-outline-danger" @click.prevent="deleteTournament">
        Delete
      </button>
      <button
        class="btn btn-outline-warning"
        v-if="!tournament.schedule"
        @click="generate"
      >
        Generate matches
      </button>
    </div>

    <div class="mt-3">
      <button
        class="btn btn-secondary"
        @click="router.push(`/tournaments/${route.params.id}/standings`)"
      >
        View standings
      </button>
    </div>
  </div>
</template>

<style scoped>
#tournament-info {
  max-width: 650px;
}
</style>
