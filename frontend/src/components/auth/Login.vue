<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const username = ref("");
const password = ref("");
const errorMessage = ref("");
const router = useRouter();

const login = async () => {
  const payload = { username: username.value, password: password.value };
  const response = await fetch("/api/auth/signin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    credentials: "include",
  });
  if (!response.ok) {
    errorMessage.value = await response.text();
  } else {
    router.push("/");
  }
};
</script>

<template>
  <h1>Login</h1>
  <form @submit.prevent="login">
    <input type="text" v-model="username" placeholder="Username" required />
    <input type="password" v-model="password" placeholder="Password" required />
    <button type="submit">Login</button>
  </form>
  <p>{{ errorMessage }}</p>
</template>
