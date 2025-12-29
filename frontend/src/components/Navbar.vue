<script setup>
import { onMounted, onUpdated, ref } from "vue";
import Login from "./auth/Login.vue";
import Signup from "./auth/Signup.vue";

const username = ref(null);
const authenticated = ref(false);

const pageState = ref("home");

const whoami = async () => {
  try {
    const response = await fetch("/api/whoami", { credentials: "include" });
    if (response.ok) {
      const data = await response.json();
      username.value = data.username;
      authenticated.value = true;
    } else {
      authenticated.value = false;
    }
  } catch (err) {
    authenticated.value = false;
  }
};

const logout = async () => {
  try {
    const response = await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    if (response.ok) {
      authenticated.value = false;
    }
  } catch (err) {
    authenticated.value = false;
  }
};

onMounted(() => {
  whoami();
});
</script>

<template>
  <Login v-if="pageState === 'login'" />
  <Signup v-else-if="pageState === 'signup'" />
  <nav v-else>
    <div v-if="!authenticated">
      <button @click="pageState = 'login'">Login</button>
      <button @click="pageState = 'signup'">Signup</button>
    </div>
    <div v-else>
      <button @click="logout">Logout</button>
      <button>{{ username }}</button>
    </div>
  </nav>
</template>
