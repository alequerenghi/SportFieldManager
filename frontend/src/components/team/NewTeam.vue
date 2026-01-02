<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const name = ref("");
const router = useRouter();
const errorMessage = ref("");

const registerTeam = async () => {
  const payload = { name: name.value };
  const response = await fetch("/api/teams", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    credentials: "include",
  });
  if (!response.ok) {
    errorMessage.value = await response.text();
  } else {
    const { id } = await response.json();
    router.push(`/teams/${id}`);
  }
};
</script>

<template>
  <h1>Register a new team</h1>
  <form @submit.prevent="registerTeam">
    <input placeholder="Team name" v-model="name" />
    <button type="submit">Register team</button>
  </form>
  <p>{{ errorMessage }}</p>
</template>
