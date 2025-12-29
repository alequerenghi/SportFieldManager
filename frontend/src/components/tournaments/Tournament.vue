<script setup>
import { onMounted, ref } from "vue";

const props = defineProps({
  tournament: { type: Object, required: true },
});

const emit = defineEmits(["update-state"]);

const field = ref({});
const creator = ref({});
const userLogged = ref(false);
const message = ref("");

const deleteTournament = async () => {
  const response = await fetch(`/api/tournaments/${props.tournament._id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!response.ok) {
    const data = await response.json();
    console.error(data.error);
  } else {
    const data = await response.text();
    message.value = data;
  }
  emit("update-state", "searching");
};

onMounted(async () => {
  console.log(props.tournament);
  const response = await fetch(`/api/fields/${props.tournament.fieldId}`);
  field.value = await response.json();
  const creatorResponse = await fetch(`/api/users/${props.tournament.userId}`);
  creator.value = await creatorResponse.json();
  const whoami = await fetch("/api/whoami", { credentials: "include" });
  if (whoami.ok) {
    const user = await whoami.json();
    const { _id } = user;
    if (_id === props.tournament.userId) {
      userLogged.value = true;
    }
  }
});
</script>

<template>
  <h1>{{ tournament.name }}</h1>
  <ul>
    <li>Field: {{ tournament.sport }}</li>
    <li>Max teams: {{ tournament.maxTeams }}</li>
    <li>Field: {{ field.name }}</li>
    <li>Location: {{ field.location }}</li>
    <li>Created by: {{ creator.username }}</li>
    <li>Start date: {{ tournament.startDate }}</li>
    <li>Teams:</li>
    <ul>
      <li v-for="team in tournament.teams">
        <a>{{ team }}</a>
      </li>
    </ul>
  </ul>
  <div v-if="userLogged">
    <button>Edit info</button>
    <button>Add team</button>
    <button @click.prevent="deleteTournament">Delete</button>
    <button>Generate</button>
  </div>
  <p>{{ message }}</p>
</template>
