<script setup>
import { onMounted, ref } from "vue";
import { RouterLink, useRoute } from "vue-router";

const route = useRoute();
const user = ref(null);
const tournaments = ref(null);

onMounted(async () => {
  const response = await fetch(`/api/users/${route.params.id}`);
  const data = await response.json();
  user.value = data.user;
  tournaments.value = data.tournaments;
});
</script>

<template>
  <div v-if="user" class="container mt-4" id="user">
    <!-- User info -->
    <div class="card mb-4">
      <div class="card-body">
        <h1 class="card-title mb-3">{{ user.name }} {{ user.surname }}</h1>

        <ul class="list-group list-group-flush">
          <li class="list-group-item">
            <strong>Username:</strong> {{ user.username }}
          </li>
        </ul>
      </div>
    </div>

    <!-- Tournaments -->
    <div class="card">
      <div class="card-header">Tournaments created by {{ user.name }}</div>

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

        <li v-if="!tournaments.length" class="list-group-item text-muted">
          No tournaments created yet
        </li>
      </ul>
    </div>
  </div>
</template>
