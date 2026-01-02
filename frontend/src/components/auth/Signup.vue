<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const username = ref("");
const name = ref("");
const surname = ref("");
const password = ref("");
const errorMessage = ref("");
const router = useRouter();

const login = async () => {
  const payload = {
    username: username.value,
    name: name.value,
    surname: surname.value,
    password: password.value,
  };
  const response = await fetch("/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    errorMessage.value = await response.text();
  } else {
    router.push("/signin");
  }
};
</script>

<template>
  <h1>Signup</h1>
  <form @submit.prevent="login">
    <input type="text" v-model="username" placeholder="Username" required />
    <input type="text" v-model="name" placeholder="First Name" required />
    <input type="text" v-model="surname" placeholder="Last Name" required />
    <input type="password" v-model="password" placeholder="Password" required />
    <button type="submit">Register</button>
  </form>
  <p>{{ errorMessage }}</p>
</template>
