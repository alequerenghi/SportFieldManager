<script setup>
import { auth } from "@/stores/auth";
import { onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";

const errorMessage = ref("");
const calendar = ref("");
const slots = ref([]);
const route = useRoute();
const field = ref(null);

const makeBooking = async (slot) => {
  errorMessage.value = "";
  const response = await fetch(`/api/fields/${route.params.id}/bookings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ date: calendar.value, slot: slot.slot }),
    credentials: "include",
  });
  if (!response.ok) {
    const { err } = await response.json();
    errorMessage.value = err;
  } else {
    const { id } = await response.json();
    errorMessage.value = "";
    slot.me = true;
    slot.available = false;
    slot._id = id;
  }
};

const deleteBooking = async (slot) => {
  errorMessage.value = "";
  const response = await fetch(
    `/api/fields/${route.params.id}/bookings/${slot._id}`,
    {
      method: "DELETE",
      credentials: "include",
    }
  );
  if (!response.ok) {
    errorMessage.value = await response.text();
  } else {
    slot.available = true;
    slot.me = false;
    slot._id = null;
  }
};

watch(calendar, async (date) => {
  errorMessage.value = "";
  const response = await fetch(
    `/api/fields/${route.params.id}/slots?date=${date}`
  );
  if (!response.ok) {
    errorMessage.value = await response.text();
  } else {
    slots.value = await response.json();
  }
});

onMounted(async () => {
  calendar.value = new Date().toISOString().substring(0, 10);
  const response = await fetch(`/api/fields/${route.params.id}`);
  field.value = await response.json();
  await auth.fetchUser();
});
</script>

<template>
  <div v-if="field">
    <h1>{{ field.name }}</h1>
    <ul>
      <li>Sport: {{ field.sport }}</li>
      <li>Location: {{ field.location }}</li>
      <li>
        Opening Hours:
        {{ `${field.slots[0]}-${field.slots[field.slots.length - 1]}` }}
      </li>
      <form>
        <input type="date" v-model="calendar" />
      </form>
      <div v-if="auth.authenticated" class="d-grid gap-2 d-md-block">
        <ul>
          <li v-for="slot in slots" :key="slot.slot">
            <button
              @click="makeBooking(slot)"
              :disabled="!slot.available"
              class="btn btn-outline-primary btn-lg btn-block"
            >
              {{ slot.slot }}
            </button>
            <button
              v-if="slot.me"
              @click="deleteBooking(slot)"
              class="btn btn-danger btn-sm"
            >
              DELETE
            </button>
          </li>
        </ul>
      </div>
    </ul>
    <p>{{ errorMessage }}</p>
  </div>
</template>

<style scoped>
button {
  width: 6em;
}
</style>
