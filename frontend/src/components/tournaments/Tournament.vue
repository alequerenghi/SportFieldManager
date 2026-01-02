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
  const response = await fetch(`/api/tournaments/${route.params.id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!response.ok) {
    errorMessage.value = await response.text();
  }
  router.push("/");
};

const updateTournamentInfo = async () => {
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
    errorMessage.value = await response.text();
  } else {
    await loadTournament();
  }
  modifying.value = "no";
};

const generate = async () => {
  const response = await fetch(
    `/api/tournaments/${route.params.id}/matches/generate`,
    {
      method: "POST",
      credentials: "include",
    }
  );
  if (!response.ok) {
    errorMessage.value = await response.text();
  }
  router.push(`/tournament/${route.params.id}/schedule`);
};

const loadTournament = async () => {
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
  <div v-if="tournament">
    <h1>{{ tournament.name }}</h1>
    <div>
      <ul>
        <li>Sport: {{ tournament.sport }}</li>
        <li>Max teams: {{ tournament.maxTeams }}</li>
        <li v-if="creatorData">
          Created by:
          <RouterLink :to="`/users/${creatorData._id}`">
            {{ creatorData.username }}</RouterLink
          >
        </li>
        <li>Start date: {{ new Date(tournament.startDate).toDateString() }}</li>
        <li>Teams:</li>
        <ul>
          <li v-for="team in tournament.teams">
            <RouterLink :to="`/team/${team._id}`">{{ team.name }}</RouterLink>
          </li>
        </ul>
        <li v-if="tournament.schedule">
          <RouterLink
            :to="`/tournaments/${route.params.id}/schedule`"
            :tournament="tournament"
            >Schedule</RouterLink
          >
        </li>
        <form
          v-if="modifying === 'teams'"
          @submit.prevent="updateTournamentInfo"
        >
          <input
            v-if="tournament.teams.length <= tournament.maxTeams"
            placeholder="Team Name"
            v-model="newTeam"
          />
          <ul v-if="showSuggestions">
            <li v-for="team in suggestedTeams" :key="team.name">
              <a @click="addTeam(team)">{{ team.name }}</a>
            </li>
          </ul>
          <input type="submit" value="Send data" />
        </form>
        <form
          v-else-if="modifying === 'info'"
          @submit.prevent="updateTournamentInfo"
        >
          <input
            type="text"
            placeholder="New Team Name"
            v-model="newTeamName"
          />
          <input
            type="number"
            placeholder="{{ tournament.maxTeams }}"
            v-model.number="newMaxTeams"
          />
          <input type="submit" value="Send data" />
        </form>
      </ul>
      <div v-if="isCreator">
        <button @click="modifying = 'info'">Edit info</button>
        <button @click="modifying = 'teams'">Add team</button>
        <button @click.prevent="deleteTournament">Delete</button>
        <button @click="generate" v-if="!tournament.schedule">Generate</button>
      </div>
      <button
        @click="router.push(`/tournaments/${route.params.id}/standings`)"
        :tournamentId="route.params.id"
        :sport="tournament.sport"
      >
        Go to standings
      </button>
      <p>{{ errorMessage }}</p>
    </div>
  </div>
</template>
