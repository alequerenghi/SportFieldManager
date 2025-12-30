<script setup>
import { onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";

const message = ref("");
const calendar = ref("");
const slots = ref([]);
const route = useRoute();
const field = ref(null);

watch(calendar, async (date) => {
  console.log(date);
  const response = await fetch(
    `/api/fields/${route.params.id}/slots?date=${date}`
  );
  if (!response.ok) {
    message.value = await response.json();
  } else {
    message.value = "";
    const data = await response.json();
    const whoami = await fetch("/api/whoami", {
      credentials: "include",
    });
    if (!whoami.ok) {
      data.forEach((element) => {
        element.me = false;
        element.available = false;
      });
      message.value = "Please sign in first";
    }
    slots.value = data;
  }
});

const makeBooking = async (slot) => {
  const response = await fetch(`/api/fields/${route.params.id}/bookings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ date: calendar.value, slot: slot.slot }),
    credentials: "include",
  });
  if (!response.ok) {
    const { err } = await response.json();
    message.value = err;
  } else {
    const { bookingId } = await response.json();
    message.value = "";
    slot.me = true;
    slot.available = false;
    slot._id = bookingId;
  }
};

const deleteBooking = async (slot) => {
  const response = await fetch(
    `/api/fields/${route.params._id}/bookings/${slot._id}`,
    {
      method: "DELETE",
      credentials: "include",
    }
  );
  if (!response.ok) {
    const { error } = await response.json();
    message.value = error;
  } else {
    slot.available = true;
    slot.me = false;
    slot._id = null;
    const { message: data } = await response.json();
    message.value = data;
  }
};

onMounted(() => (calendar.value = new Date().toISOString().substring(0, 10)));
onMounted(async () => {
  const response = await fetch(`/api/fields/${route.params.id}`);
  field.value = await response.json();
});
</script>

<template>
  <div v-if="field">
    <h1>{{ field.name }}</h1>
    <ul>
      <li>Field: {{ field.sport }}</li>
      <li>Location: {{ field.location }}</li>
      <li>
        Opening Hours:
        {{ `${field.slots[0]}-${field.slots[field.slots.length - 1]}` }}
      </li>
      <form>
        <input type="date" v-model="calendar" />
      </form>
      <ul>
        <li v-for="slot in slots">
          <button @click="makeBooking(slot)" :disabled="!slot.available">
            {{ slot.slot }}
          </button>
          <button v-if="slot.me" @click="deleteBooking(slot)">DELETE</button>
        </li>
        <p>{{ message }}</p>
      </ul>
    </ul>
  </div>
</template>
