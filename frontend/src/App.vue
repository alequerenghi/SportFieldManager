<script setup>
import { onUpdated, ref } from "vue";
import Navbar from "@/components/Navbar.vue";
import { useRoute } from "vue-router";

const pageState = ref("main");
const route = useRoute();

onUpdated(pageState, () => console.log(pageState.value));
</script>

<template>
  <header>
    <!-- <img
      alt="Vue logo"
      class="logo"
      src="./assets/logo.svg"
      width="125"
      height="125"
    /> -->
  </header>

  <main>
    <Navbar v-if="!route.meta.hideNavBar" />
    <router-view />
  </main>
</template>
