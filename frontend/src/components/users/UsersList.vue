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
  <div class="container mt-4" id="users">
    <!-- Search -->
    <div class="card mb-4">
      <div class="card-body">
        <input
          v-model="searchBar"
          type="text"
          class="form-control"
          placeholder="Search users"
        />
      </div>
    </div>

    <!-- Users list -->
    <div class="card">
      <div class="card-header">Users</div>

      <ul class="list-group list-group-flush">
        <li v-for="user in users" :key="user._id" class="list-group-item">
          <RouterLink :to="`/users/${user._id}`">
            {{ user.username }}
          </RouterLink>
        </li>

        <li v-if="!users.length" class="list-group-item text-muted">
          No users found
        </li>
      </ul>
    </div>
  </div>
</template>
