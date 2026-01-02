<script setup>
import { RouterLink, useRouter } from "vue-router";
import { onMounted, onUnmounted, ref } from "vue";
import { auth } from "@/stores/auth";

const router = useRouter();

const menu = ref(false);
const menuRef = ref(null);

const logout = async () => {
  const response = await fetch("/api/auth/logout", {
    method: "POST",
    credentials: "include",
  });
  if (response.ok) {
    auth.authenticated = false;
    auth.username = null;
  }
};

const handleClickOutside = (event) => {
  if (menuRef.value && !menuRef.value.contains(event.target)) {
    menu.value = false;
  }
};

onMounted(async () => {
  await auth.fetchUser();
  document.addEventListener("click", handleClickOutside);
});
onUnmounted(() => document.removeEventListener("click", handleClickOutside));
</script>

<template>
  <nav>
    <div v-if="!auth.authenticated">
      <button @click="router.push('/login')">Login</button>
      <button @click="router.push('/signup')">Signup</button>
    </div>
    <div v-else>
      <button @click="logout">Logout</button>
      <button @click.stop="menu = !menu">
        {{ auth.username }}
      </button>
      <div v-if="menu" ref="menuRef">
        <RouterLink to="/tournaments/new">New tournament</RouterLink>
        <RouterLink to="/teams/new">New team</RouterLink>
        <RouterLink to="/users">Users</RouterLink>
      </div>
    </div>
  </nav>
</template>
