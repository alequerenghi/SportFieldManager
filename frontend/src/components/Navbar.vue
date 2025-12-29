<script setup>
import { onMounted, ref } from "vue";

const props = defineProps({
  state: String,
});
const emit = defineEmits(["update-state"]);
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

// const handleClickOutside = () => {
//   showSuggestions.value = false;
// };

// onMounted(() => document.addEventListener("click", handleClickOutside));
// onUnmounted(() => document.removeEventListener("click", handleClickOutside));
</script>

<template>
  <nav>
    <div v-if="!authenticated">
      <button @click.prevent="emit('update-state', 'login')">Login</button>
      <button @click.prevent="emit('update-state', 'signup')">Signup</button>
    </div>
    <div v-else>
      <button @click.prevent="logout">Logout</button>
      <button @click.prevent="menu = true">
        {{ username }}
      </button>
      <div v-if="menu">
        <a @click="emit('update-state', 'new-tournament')">New tournament</a>
      </div>
    </div>
  </nav>
</template>
