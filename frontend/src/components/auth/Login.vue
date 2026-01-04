<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const username = ref("");
const password = ref("");
const errorMessage = ref("");
const router = useRouter();

const login = async () => {
  const payload = { username: username.value, password: password.value };
  const response = await fetch("/api/auth/signin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    credentials: "include",
  });
  if (!response.ok) {
    const { error } = await response.json();
    errorMessage.value = error;
  } else {
    router.push("/");
  }
};
</script>

<template>
  <div id="login-page" class="container">
    <h1 class="mb-3">Login</h1>
    <form @submit.prevent="login" class="mb-4">
      <div class="row mb-3">
        <label class="col-sm-2 col-form-label">Username</label>
        <div class="col-sm-10">
          <input
            type="text"
            v-model="username"
            placeholder="Insert username"
            required
            class="form-control"
          />
        </div>
      </div>
      <div class="row mb-3">
        <label class="col-sm-2 col-form-label">Username</label>
        <div class="col-sm-10">
          <input
            type="password"
            v-model="password"
            placeholder="Password"
            required
          />
        </div>
      </div>
      <button type="submit" class="btn btn-success">Login</button>
    </form>
    <p v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</p>
    <RouterLink to="/signup">Not a user, signup instead</RouterLink>
  </div>
</template>

<style scoped>
#login-page {
  max-width: 650px;
}
</style>
