<script setup>
import { RouterLink, useRouter } from "vue-router";
import { onMounted } from "vue";
import { auth } from "@/stores/auth";

const router = useRouter();

const logout = async () => {
  const response = await fetch("/api/auth/logout", {
    method: "POST",
    credentials: "include",
  });
  if (response.ok) {
    auth.authenticated = false;
    auth.username = null;
    auth._id = null;
  }
};

onMounted(async () => await auth.fetchUser());
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <button @click="router.push('/')">Home</button>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNavDropdown"
        aria-controls="navbarNavDropdown"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div
        v-if="!auth.authenticated"
        class="collapse navbar-collapse"
        id="navbarNavDropdown"
      >
        <button @click="router.push('/login')">Login</button>
        <button @click="router.push('/signup')">Signup</button>
      </div>
      <div v-else class="collapse navbar-collapse" id="navbarNavDropdown">
        <ul class="navbar-nav">
          <li class="nav-item">
            <a @click="logout" class="nav-link active">Logout</a>
          </li>
          <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              id="navbarDropdownMenuLink"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {{ auth.username }}
            </a>
            <div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
              <RouterLink class="dropdown-item" to="/tournaments/new"
                >New tournament</RouterLink
              >
              <RouterLink class="dropdown-item" to="/teams/new"
                >New team</RouterLink
              >
              <RouterLink class="dropdown-item" to="/users">Users</RouterLink>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
