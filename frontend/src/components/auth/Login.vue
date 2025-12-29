<script setup>
import { ref } from "vue";

const emit = defineEmits(["success"]);

const username = ref("");
const password = ref("");
const message = ref("");
const login = async () => {
  const payload = { username: username.value, password: password.value };
  const response = await fetch("/api/auth/signin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    credentials: "include",
  });
  if (!response.ok) {
    const data = await response.json();
    const { error } = data;
    message.value = error;
  } else {
    emit("success", "main");
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
  <p>{{ message }}</p>
</template>
