<script setup>
import { onMounted, ref, watch } from "vue";
import { RouterLink } from "vue-router";
import { searchSingle } from "../utils";

const users = ref([]);
const searchBar = ref("");

let debounce = null;
watch(searchBar, (query) => {
  clearTimeout(debounce);
  debounce = setTimeout(async () => await updateUsers(query), 400);
});

const updateUsers = async (query) =>
  (users.value = await searchSingle("users", query));

onMounted(async () => await updateUsers(""));
</script>

<template>
  <input v-model="searchBar" placeholder="Search" />
  <ul>
    <li v-for="user in users" :key="user.username">
      <RouterLink :to="`/users/${user._id}`" :user="user">{{
        user.username
      }}</RouterLink>
    </li>
  </ul>
</template>
