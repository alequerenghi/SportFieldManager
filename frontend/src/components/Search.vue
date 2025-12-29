<script setup>
import { ref, watch } from "vue";
import Field from "./Field.vue";

const searching = ref(true);
const fields = ref([]);
const searchBar = ref("");
let debounce = null;
watch(searchBar, (val) => {
  clearTimeout(debounce);
  debounce = setTimeout(async () => {
    try {
      const response = await fetch(`/api/fields?q=${val}`);
      const data = await response.json();
      fields.value = data;
    } catch (err) {
      console.error("err");
    }
  }, 400);
});
let chosenField = null;

const fieldDetails = async (fieldId) => {
  const response = await fetch(`/api/fields/${fieldId}`);
  if (!response.ok) {
    // TODO
  } else {
    const data = await response.json();
    chosenField = data;
    searching.value = false;
  }
};
</script>

<template>
  <input type="text" v-model="searchBar" />
  <div v-if="searching">
    <h2>Fields</h2>
    <ul>
      <li v-for="field in fields">
        <a @click.prevent="fieldDetails(field._id)">{{ field.name }}</a>
      </li>
    </ul>
  </div>
  <div v-else>
    <Field :field="chosenField" />
  </div>
</template>
