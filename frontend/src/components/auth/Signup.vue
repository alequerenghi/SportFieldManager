<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const username = ref("");
const name = ref("");
const surname = ref("");
const password = ref("");
const errorMessage = ref("");
const router = useRouter();
const repeatPassword = ref("");

const signup = async () => {
  errorMessage.value = "";
  if (password.value !== repeatPassword.value) {
    errorMessage.value = "Passwords don't match";
  } else if (password.value.length < 8) {
    errorMessage.value = "Minimum password length is 8 characters";
  } else {
    const payload = {
      username: username.value,
      name: name.value,
      surname: surname.value,
      password: password.value,
    };
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const { error } = await response.json();
      errorMessage.value = error;
    } else {
      router.push("/login");
    }
  }
};
</script>

<template>
  <div id="signup" class="container mt-4">
    <h1>Signup</h1>
    <form @submit.prevent="signup" class="mb-4">
      <div class="row mb-3">
        <label class="col-sm-2 col-form-label"> Username </label>
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
        <label class="col-sm-2 col-form-label"> First name </label>
        <div class="col-sm-10">
          <input
            type="text"
            v-model="name"
            placeholder="Insert first Name"
            required
            class="form-control"
          />
        </div>
      </div>
      <div class="row mb-3">
        <label class="col-sm-2 col-form-label"> Last name </label>
        <div class="col-sm-10">
          <input
            type="text"
            v-model="surname"
            placeholder="Insert last Name"
            required
            class="form-control"
          />
        </div>
      </div>
      <div class="row mb-3">
        <label class="col-sm-2 col-form-label"> Password </label>
        <div class="col-sm-10">
          <input
            type="password"
            v-model="password"
            placeholder="Insert password"
            required
            class="form-control"
          />
        </div>
      </div>
      <div class="row mb-3">
        <label class="col-sm-2 col-form-label"> Repeat password </label>
        <div class="col-sm-10">
          <input
            type="password"
            v-model="repeatPassword"
            placeholder="Insert password"
            required
            class="form-control"
          />
        </div>
      </div>
      <button type="submit" class="btn btn-success">Register</button>
    </form>
    <p>{{ errorMessage }}</p>
    <RouterLink to="/login">Already a user: signin</RouterLink>
  </div>
</template>

<style scoped>
#signup {
  max-width: 650px;
}
</style>
