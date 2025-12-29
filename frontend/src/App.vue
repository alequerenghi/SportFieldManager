<script setup>
import { ref } from "vue";
import Login from "./components/auth/Login.vue";
import Signup from "./components/auth/Signup.vue";
import Navbar from "./components/Navbar.vue";
import Search from "./components/Search.vue";

const pageState = ref("main");
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
      <Navbar :state="pageState" @update-state="pageState = $event" />
      <Search />
    </div>
  </main>
</template>
