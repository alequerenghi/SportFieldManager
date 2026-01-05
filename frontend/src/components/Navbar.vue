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
  <nav class="navbar navbar-expand-lg navbar-light bg-light sticky-top">
    <div class="container-fluid">
      <!-- Brand / Home -->
      <RouterLink to="/" class="navbar-brand"> Home </RouterLink>

      <!-- Toggler -->
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Nav content -->
      <div class="collapse navbar-collapse" id="navbarNav">
        <!-- LEFT -->
        <ul class="navbar-nav">
          <li class="nav-item">
            <RouterLink class="nav-link" to="/users">Users</RouterLink>
          </li>
        </ul>

        <!-- RIGHT -->
        <ul class="navbar-nav ms-lg-auto align-items-lg-center">
          <!-- Not authenticated -->
          <template v-if="!auth.authenticated">
            <li class="nav-item mb-2 mb-lg-0 me-lg-2">
              <RouterLink
                to="/login"
                class="btn btn-outline-secondary btn-sm w-100 w-lg-auto"
              >
                Login
              </RouterLink>
            </li>

            <li class="nav-item mb-2 mb-lg-0">
              <RouterLink
                to="/signup"
                class="btn btn-outline-secondary btn-sm w-100 w-lg-auto"
              >
                Signup
              </RouterLink>
            </li>
          </template>

          <!-- Authenticated -->
          <template v-else>
            <li class="nav-item mb-2 mb-lg-0 me-lg-2">
              <button
                @click="logout"
                class="btn btn-outline-danger btn-sm w-100 w-lg-auto"
              >
                Logout
              </button>
            </li>

            <li class="nav-item dropdown">
              <a
                class="nav-link dropdown-toggle"
                data-bs-toggle="dropdown"
                role="button"
              >
                {{ auth.username }}
              </a>

              <ul class="dropdown-menu dropdown-menu-lg-end">
                <li>
                  <RouterLink class="dropdown-item" to="/tournaments/new">
                    New tournament
                  </RouterLink>
                </li>
                <li>
                  <RouterLink class="dropdown-item" to="/teams/new">
                    New team
                  </RouterLink>
                </li>
              </ul>
            </li>
          </template>
        </ul>
      </div>
    </div>
  </nav>
</template>
