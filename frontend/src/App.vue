<script setup>
import { onUpdated, ref } from "vue";
import Login from "./components/auth/Login.vue";
import Signup from "./components/auth/Signup.vue";
import Navbar from "./components/Navbar.vue";
import Search from "./components/Search.vue";
import NewTournament from "./components/tournaments/NewTournament.vue";

const pageState = ref("main");

onUpdated(pageState, () => console.log(pageState.value));
</script>

<template>
  <header>
    <img
      alt="Vue logo"
      class="logo"
      src="./assets/logo.svg"
      width="125"
      height="125"
    />
  </header>

  <main>
    <Login v-if="pageState === 'login'" @success="pageState = $event" />
    <Signup v-else-if="pageState === 'signup'" @success="pageState = $event" />
    <div v-else>
      <Navbar @update-state="pageState = $event" />
      <NewTournament
        v-if="pageState === 'new-tournament'"
        @update-state="pageState = $event"
      />
      <Search v-else />
    </div>
  </main>
</template>
