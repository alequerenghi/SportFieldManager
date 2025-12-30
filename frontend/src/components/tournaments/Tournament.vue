<script setup>
import { onMounted, ref, watch } from "vue";
import Schedule from "./Schedule.vue";

const props = defineProps({
  tournament: { type: Object, required: true },
});

const emit = defineEmits(["update-state"]);

const field = ref({});
const creator = ref({});
const userLogged = ref(false);
const pMessage = ref("");
const addingTeams = ref("no");
const newTeam = ref("");
const teams = ref([]);
const newMaxTeams = ref(props.tournament.maxTeams);
const newTeamName = ref("");
const showSchedule = ref(false);

const deleteTournament = async () => {
  const response = await fetch(`/api/tournaments/${props.tournament._id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!response.ok) {
    const data = await response.json();
    console.error(data.error);
  }
  emit("update-state", "searching");
};

const updateTournamentInfo = async () => {
  const payload = {
    teams: teams.value,
    maxTeams: newMaxTeams.value,
  };
  if (newTeamName.value.length < 3) {
    payload.name = props.tournament.name;
  } else {
    payload.name = newTeamName.value;
  }
  const response = await fetch(`/api/tournaments/${props.tournament._id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    credentials: "include",
  });
  if (!response.ok) {
    const { error } = await response.json();
    pMessage.value = error;
  }
  emit("update-state", "searching");
};

const generate = async () => {
  const response = await fetch(
    `/api/tournaments/${props.tournament._id}/matches/generate`,
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

onMounted(async () => {
  const response = await fetch(`/api/fields/${props.tournament.fieldId}`);
  field.value = await response.json();
  const creatorResponse = await fetch(`/api/users/${props.tournament.userId}`);
  creator.value = await creatorResponse.json();
  const whoami = await fetch("/api/whoami", { credentials: "include" });
  if (whoami.ok) {
    const user = await whoami.json();
    const { _id } = user;
    if (_id === props.tournament.userId) {
      userLogged.value = true;
    }
  }
});

watch(
  () => props.tournament.teams,
  (newTeam) => (teams.value = [...newTeam]),
  { immediate: true }
);
</script>

<template>
  <h1>{{ tournament.name }}</h1>
  <div v-if="showSchedule">
    <Schedule :tournamentId="tournament._id" />
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
        <li v-for="team in teams">
          <a>{{ team }}</a>
        </li>
      </ul>
      <li v-if="tournament.schedule">
        <a @click="showSchedule = true">Schedule</a>
      </li>
      <form
        v-if="addingTeams === 'teams'"
        @submit.prevent="updateTournamentInfo"
      >
        <input type="text" placeholder="Team Name" v-model="newTeam" />
        <button @click.prevent="teams.push(newTeam)">Add one</button>
        <input type="submit" value="Send data" />
      </form>
      <form
        v-else-if="addingTeams === 'info'"
        @submit.prevent="updateTournamentInfo"
      >
        <input type="text" placeholder="New Team Name" v-model="newTeamName" />
        <input
          type="number"
          placeholder="{{ tournament.maxTeams }}"
          v-model="newMaxTeams"
        />
        <input type="submit" value="Send data" />
      </form>
    </ul>
    <div v-if="userLogged">
      <button @click="addingTeams = 'info'">Edit info</button>
      <button @click="addingTeams = 'teams'">Add team</button>
      <button @click.prevent="deleteTournament">Delete</button>
      <button @click="generate" v-if="!tournament.schedule">Generate</button>
    </div>
    <p>{{ pMessage }}</p>
  </div>
</template>
