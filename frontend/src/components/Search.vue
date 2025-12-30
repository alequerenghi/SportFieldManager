<script setup>
import { ref, watch } from "vue";
import Field from "./Field.vue";
import { searchSingle } from "./utils.js";
import Tournament from "./tournaments/Tournament.vue";
import { useRouter } from "vue-router";

const mainPage = ref("searching");
const fields = ref([]);
const tournaments = ref([]);
const searchBar = ref(" ");
let debounce = null;
const router = useRouter();

const search = async (val) => {
  try {
    fields.value = await searchSingle("fields", val);
    tournaments.value = await searchSingle("tournaments", val);
  } catch (err) {
    console.error(err);
  }
};

watch(searchBar, async (val) => {
  clearTimeout(debounce);
  debounce = setTimeout(await search(val), 400);
});

const fieldDetails = async (fieldId) => {
  const response = await fetch(`/api/fields/${fieldId}`);
  if (!response.ok) {
    // TODO
  } else {
    const data = await response.json();
    router.push(`/fields/${data._id}`);
  }
};
</script>

<template>
  <input type="text" placeholder="Search" v-model="searchBar" />
  <div>
    <h2 v-if="fields.length">Fields</h2>
    <ul>
      <li v-for="field in fields">
        <a @click.prevent="fieldDetails(field._id)">{{ field.name }}</a>
      </li>
    </ul>
    <h2 v-if="tournaments.length">Tournaments</h2>
    <ul>
      <li v-for="tournament in tournaments">
        <RouterLink :to="`/tournaments/${tournament._id}`">{{
          tournament.name
        }}</RouterLink>
      </li>
    </ul>
  </div>
</template>
