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
  <div v-if="user">
    <h1>{{ user.name }} {{ user.surname }}</h1>
    <p>{{ user.username }}</p>
    <ul>
      <li v-for="tournament in tournaments">
        <RouterLink :to="`/tournaments/${tournament._id}`">{{
          tournament.name
        }}</RouterLink>
      </li>
    </ul>
  </div>
</template>
