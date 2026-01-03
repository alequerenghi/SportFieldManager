<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const name = ref("");
const router = useRouter();
const errorMessage = ref("");

const registerTeam = async () => {
  const payload = { name: name.value };
  const response = await fetch("/api/teams", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    credentials: "include",
  });
  if (!response.ok) {
    errorMessage.value = await response.text();
  } else {
    const { id } = await response.json();
    router.push(`/teams/${id}`);
  }
};
</script>

<template>
  <h1>Register a new team</h1>
  <form @submit.prevent="registerTeam" class="w-100">
    <div class="mb-5">
      <div class="row mb-3">
        <label class="col-md-3 d-flex align-items-center">Team name</label>
        <input placeholder="Team name" v-model="name" class="col-md-9" />
      </div>
      <button
        type="submit"
        data-mdb-button-init
        data-mdb-ripple-init
        class="btn btn-primary"
      >
        Register team
      </button>
    </div>
  </form>
  <p>{{ errorMessage }}</p>
</template>

<style scoped>
form {
  max-width: 650px;
}
</style>
