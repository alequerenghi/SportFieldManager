<script setup>
import { auth } from "@/stores/auth";
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const name = ref("");
const maxTeams = ref(5);
const startDate = ref("");
const errorMessage = ref("");
const sport = ref("");

const createTournament = async () => {
  await auth.fetchUser();
  errorMessage.value = "";
  const tournament = {
    name: name.value,
    maxTeams: maxTeams.value,
    sport: sport.value,
    startDate: startDate.value,
  };
  const response = await fetch("/api/tournaments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(tournament),
    credentials: "include",
  });
  if (!response.ok) {
    const { error } = await response.json();
    errorMessage.value = error;
  } else {
    const { id } = await response.json();
    router.push(`/tournaments/${id}`);
  }
};
</script>

<template>
  <div id="new-tournament" class="container">
    <h1>Register new tournament</h1>
    <p v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</p>
    <form @submit.prevent="createTournament" class="w-100">
      <div class="row mb-3">
        <div class="col-md-3 d-flex align-items-center">
          <p class="mb-0 p-0">Tournament name:</p>
        </div>
        <div class="col-md-8">
          <div data-mdb-input-init class="form-outline">
            <input
              v-model="name"
              class="form-control"
              id="tournament-name"
              placeholder="Enter name"
              required
            />
          </div>
        </div>
      </div>
      <div class="row mb-3">
        <div class="col-md-3 d-flex align-items-center">
          <p class="mb-0 p-0">Max teams</p>
        </div>
        <div class="col-md-8">
          <div data-mdb-input-init class="form-outline">
            <input
              type="number"
              v-model.number="maxTeams"
              class="form-control"
              id="maxTeams"
              required
            />
          </div>
        </div>
      </div>
      <div class="row mb-3">
        <div class="col-md-3 d-flex align-items-center">
          <p class="mb-0 p-0">Sport:</p>
        </div>
        <div class="col-md-8">
          <div data-mdb-input-init class="form-outline">
            <input
              placeholder="Sport"
              v-model="sport"
              class="form-control"
              id="sport"
              required
            />
          </div>
        </div>
      </div>
      <div class="row mb-3">
        <div class="col-md-3 d-flex align-items-center">
          <p class="mb-0 p-0">Start date:</p>
        </div>
        <div class="col-md-8">
          <div data-mdb-input-init class="form-outline">
            <input
              type="date"
              placeholder="Start date"
              v-model="startDate"
              class="form-control"
              id="date"
              required
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        data-mdb-button-init
        data-mdb-ripple-init
        class="btn btn-success"
      >
        Register team
      </button>
    </form>
  </div>
</template>

<style scoped>
#new-tournament {
  max-width: 650px;
}
</style>
