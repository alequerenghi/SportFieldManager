import { generateSlots } from "./bookings.js";

const querySlots = async (fieldId, booking) => {
  const response = await fetch(`/api/fields/${fieldId}/slots?date=${booking}`, {
    credentials: "include",
  });
  if (!response.ok) {
    const message = document.createElement("p");
    message.innerText = "Please insert a valid date";
    return message;
  }
  const data = await response.json();
  return await generateSlots(data, fieldId, booking);
};

const fieldDetails = async (app, id) => {
  const response = await fetch(`/api/fields/${id}`);
  if (!response.ok) {
    app.innerHTML = "";
    const errorMessage = document.createElement("h1");
    errorMessage.innerText = response.body;
    app.append(errorMessage);
  } else {
    const data = await response.json();
    const { _id, name, sport, location, slots } = data;
    const fieldSport = document.createElement("li");
    fieldSport.innerText = sport;

    const fieldLocation = document.createElement("li");
    fieldLocation.innerText = location;

    const openingHours = document.createElement("li");
    openingHours.innerText = `${slots[0]}-${slots[slots.length - 1]}`;

    const bookingDate = document.createElement("input");
    bookingDate.type = "date";

    const bookingConfirm = document.createElement("input");
    bookingConfirm.type = "submit";

    const booking = document.createElement("div");

    const bookingForm = document.createElement("form");
    bookingForm.append(bookingDate, bookingConfirm);
    bookingForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const slots = await querySlots(_id, bookingDate.value);
      booking.innerHTML = "";
      booking.appendChild(slots);
    });

    const fieldInfo = document.createElement("ul");
    fieldInfo.append(fieldSport, fieldLocation, openingHours);

    const header = document.createElement("h1");
    header.innerText = name;

    app.innerHTML = "";
    app.append(header, fieldInfo, bookingForm, booking);
  }
};

export { fieldDetails };
