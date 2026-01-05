<script setup>
import Navbar from "@/components/Navbar.vue";
import { useRoute } from "vue-router";

const route = useRoute();
</script>

<template>
  <header></header>

  <main class="container" id="app">
    <Navbar v-if="!route.meta.hideNavBar" />
    <router-view />
  </main>
</template>
