<script setup>
import { useRouter } from "vue-router";
import { onMounted, onUnmounted, ref } from "vue";

const router = useRouter();

const username = ref(null);
const authenticated = ref(false);
const menu = ref(false);

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

onMounted(() => whoami());

const handleClickOutside = () => {
  menu.value = false;
};

onMounted(() => document.addEventListener("click", handleClickOutside));
onUnmounted(() => document.removeEventListener("click", handleClickOutside));
</script>

<template>
  <nav>
    <div v-if="!authenticated">
      <button @click="router.push('/login')">Login</button>
      <button @click="router.push('/signup')">Signup</button>
    </div>
    <div v-else>
      <button @click="logout">Logout</button>
      <button @click="menu = true">
        {{ username }}
      </button>
      <div v-if="menu">
        <a @click="router.push('/tournaments/new')">New tournament</a>
      </div>
    </div>
  </nav>
</template>
