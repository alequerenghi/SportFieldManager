<script setup>
import { onMounted, ref, watch } from "vue";
import Schedule from "./Schedule.vue";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();
const field = ref({});
const creator = ref({});
const userLogged = ref(false);
const pMessage = ref("");
const modifying = ref("no");
const newTeam = ref("");
const newMaxTeams = ref(0);
const newTeamName = ref("");
const showSchedule = ref(false);
const tournament = ref(null);

const deleteTournament = async () => {
  const response = await fetch(`/api/tournaments/${route.params.id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!response.ok) {
    const data = await response.json();
    console.error(data.error);
  }
  router.push("/");
};

const updateTournamentInfo = async () => {
  try {
    const payload = {
      teams: tournament.value.teams,
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
      pMessage.value = error;
    }
  } catch (error) {
    console.error(error);
  }
  await loadTournament();
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
    // const { error } = await response.json();
    pMessage.value = await response.text();
  }
};
const loadTournament = async () => {
  const response = await fetch(`/api/tournaments/${route.params.id}`, {
    credentials: "include",
  });
  tournament.value = await response.json();
};

const addTeam = () => {
  tournament.value.teams.push(newTeam.value);
  newTeam.value = "";
};
onMounted(async () => {
  await loadTournament();
  const { fieldId, maxTeams, userId } = tournament.value;
  newMaxTeams.value = maxTeams;

  const fieldInfo = await fetch(`/api/fields/${fieldId}`);
  field.value = await fieldInfo.json();

  const creatorResponse = await fetch(`/api/users/${userId}`);
  creator.value = await creatorResponse.json();
  const whoami = await fetch("/api/whoami", { credentials: "include" });
  if (whoami.ok) {
    const user = await whoami.json();
    const { _id } = user;
    if (_id === userId) {
      userLogged.value = true;
    }
  }
});
</script>

<template>
  <div v-if="tournament">
    <h1>{{ tournament.name }}</h1>
    <div v-if="showSchedule">
      <Schedule :tournamentId="route.params.id" />
    </div>
    <div v-else>
      <ul>
        <li>Field: {{ tournament.sport }}</li>
        <li>Max teams: {{ tournament.maxTeams }}</li>
        <li>Field: {{ field.name }}</li>
        <li>Location: {{ field.location }}</li>
        <li>Created by: {{ creator.username }}</li>
        <li>Start date: {{ new Date(tournament.startDate).toDateString() }}</li>
        <li>Teams:</li>
        <ul>
          <li v-for="team in tournament.teams">
            <a>{{ team }}</a>
          </li>
        </ul>
        <li v-if="tournament.schedule">
          <a @click="showSchedule = true">Schedule</a>
        </li>
        <form
          v-if="modifying === 'teams'"
          @submit.prevent="updateTournamentInfo"
        >
          <input type="text" placeholder="Team Name" v-model="newTeam" />
          <button @click.prevent="addTeam">Add one</button>
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
            v-model="newMaxTeams"
          />
          <input type="submit" value="Send data" />
        </form>
      </ul>
      <div v-if="userLogged">
        <button @click="modifying = 'info'">Edit info</button>
        <button @click="modifying = 'teams'">Add team</button>
        <button @click.prevent="deleteTournament">Delete</button>
        <button @click="generate" v-if="!tournament.schedule">Generate</button>
      </div>
      <p>{{ pMessage }}</p>
    </div>
  </div>
</template>
