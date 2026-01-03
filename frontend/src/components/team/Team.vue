<script setup>
import { auth } from "@/stores/auth";
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const creator = computed(() => auth._id === team.value.userId);
const adding = ref(false);
const name = ref("");
const surname = ref("");
const jerseyNumber = ref(null);
const team = ref(null);
const errorMessage = ref("");

const addPlayer = () => {
  errorMessage.value = "";
  if (!name.value || !surname.value) {
    errorMessage.value = "Name and surname are required";
    return;
  }
  const newPlayer = {
    name: name.value,
    surname: surname.value,
    jerseyNumber: jerseyNumber.value,
  };
  if (!newPlayer.jerseyNumber) {
    delete newPlayer.jerseyNumber;
  }
  team.value.players.push(newPlayer);
  name.value = "";
  surname.value = "";
  jerseyNumber.value = null;
};

const registerNewPlayers = async () => {
  errorMessage.value = "";
  const response = await fetch(`/api/teams/${route.params.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(team.value.players),
    credentials: "include",
  });
  if (!response.ok) {
    const { error } = await response.json();
    errorMessage.value = error;
  } else {
    await loadTeam();
  }
};

const loadTeam = async () => {
  await auth.fetchUser();
  errorMessage.value = "";
  adding.value = false;
  const response = await fetch(`/api/teams/${route.params.id}`);
  if (!response.ok) {
    const { status } = response;
    const { error } = await response.json();
    errorMessage.value = `Error ${status}: ${error}`;
  } else {
    team.value = await response.json();
  }
};

onMounted(async () => await loadTeam());
</script>

<template>
  <div v-if="team" class="container mt-4" id="team">
    <h1 class="mb-4">{{ team.name }}</h1>
    <p v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</p>
    <form
      v-if="creator && adding"
      @submit.prevent="registerNewPlayers"
      class="mb-4"
    >
      <div class="row mb-3 align-items-center">
        <label class="col-md-4 col-form-label">Player name</label>
        <div class="col-md-8">
          <input v-model="name" placeholder="Name" class="form-control" />
        </div>
      </div>
      <div class="row mb-3 align-items-center">
        <label class="col-md-4 col-form-label">Player surname</label>
        <div class="col-md-8">
          <input v-model="surname" placeholder="Surname" class="form-control" />
        </div>
      </div>
      <div class="row mb-3 align-items-center">
        <label class="col-md-4 col-form-label">
          Player jersey (optional)
        </label>
        <div class="col-md-8">
          <input type="number" v-model="jerseyNumber" class="form-control" />
        </div>
      </div>
      <div class="d-flex gap-2">
        <button
          type="button"
          @click="addPlayer"
          class="btn btn-outline-success btn-sm col-md-2"
        >
          Add player
        </button>
        <button type="submit" class="btn btn-success btn-sm col-md-2">
          Send data
        </button>
      </div>
    </form>
    <p><strong>Team members</strong></p>
    <ul class="mb-4">
      <li v-for="(player, index) in team.players" :key="index">
        {{ player.name }} <strong>{{ player.surname }}</strong>
        {{ player.jerseyNumber ? `: ${player.jerseyNumber}` : "" }}
      </li>
    </ul>
    <button
      v-if="creator && !adding"
      type="submit"
      @click="adding = true"
      class="btn btn-primary"
    >
      Add new players
    </button>
  </div>
</template>

<style scoped>
#team {
  max-width: 650px;
}
</style>
