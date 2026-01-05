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
    const { error } = await response.json();
    errorMessage.value = error;
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
    const { error } = await response.json();
    errorMessage.value = error;
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
  <div v-if="field" class="container mt-4" id="field">
    <h1 class="mb-3">{{ field.name }}</h1>
    <p v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</p>
    <ul class="list-unstyled mb-4">
      <li><strong>Location: </strong>{{ field.location }}</li>
      <li><strong>Sport: </strong> {{ field.sport }}</li>
      <li class="mb-2">
        <strong>Opening Hours:</strong>
        {{ `${field.slots[0]}-${field.slots[field.slots.length - 1]}` }}
      </li>
      <form v-if="auth.authenticated" class="mb-4">
        <label class="form-label">Select date</label>
        <input type="date" v-model="calendar" class="form-control" />
      </form>
      <div v-if="auth.authenticated" class="d-grid d-md-block">
        <p>Bookable slots:</p>
        <ul class="list-unstyled">
          <li v-for="slot in slots" :key="slot.slot" class="mb-2">
            <div class="d-flex align-items-center gap-2">
              <button
                @click="makeBooking(slot)"
                :disabled="!slot.available"
                class="btn btn-secondary btn-sm btn-block"
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
            </div>
          </li>
        </ul>
      </div>
    </ul>
  </div>
</template>

<style scoped>
#field {
  max-width: 650px;
}
</style>
