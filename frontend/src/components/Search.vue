<script setup>
import { ref, watch } from "vue";
import Field from "./Field.vue";
import { searchSingle } from "./utils.js";
import Tournament from "./tournaments/Tournament.vue";

const mainPage = ref("searching");
const fields = ref([]);
const tournaments = ref([]);
const searchBar = ref(" ");
let debounce = null;

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

let chosenField = null;
const fieldDetails = async (fieldId) => {
  const response = await fetch(`/api/fields/${fieldId}`);
  if (!response.ok) {
    // TODO
  } else {
    const data = await response.json();
    chosenField = data;
    mainPage.value = "field";
  }
};

let chosenTournament = null;
const tournamentDetails = async (torunamentId) => {
  const response = await fetch(`/api/tournaments/${torunamentId}`);
  if (!response.ok) {
  } else {
    const data = await response.json();
    chosenTournament = data;
    mainPage.value = "tournament";
  }
};
</script>

<template>
  <input type="text" v-model="searchBar" />
  <div v-if="mainPage === 'tournament'">
    <Tournament
      :tournament="chosenTournament"
      @update-state="mainPage = $event"
    />
  </div>
  <div v-else-if="mainPage === 'field'">
    <Field :field="chosenField" />
  </div>
  <div v-else>
    <h2>Fields</h2>
    <ul>
      <li v-for="field in fields">
        <a @click.prevent="fieldDetails(field._id)">{{ field.name }}</a>
      </li>
    </ul>
    <h2>Tournaments</h2>
    <ul>
      <li v-for="tournament in tournaments">
        <a @click.prevent="tournamentDetails(tournament._id)">{{
          tournament.name
        }}</a>
      </li>
    </ul>
  </div>
</template>
