import { whoami } from "./auth.js";

const createDeleteBooking = (fieldId, bookingId, bookingButton) => {
  const deleteBooking = document.createElement("button");
  deleteBooking.innerText = "DELETE";
  deleteBooking.onclick = async (e) => {
    e.preventDefault();
    const response = await fetch(
      `/api/fields/${fieldId}/bookings/${bookingId}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );
    if (response.ok) {
      bookingButton.disabled = false;
      deleteBooking.remove();
    }
  };
  return deleteBooking;
};

const generateSlots = async (data, fieldId, booking) => {
  const message = document.createElement("p");
  const bookingSlots = document.createElement("ul");
  data.forEach((element) => {
    const { slot, available, me, _id } = element;

    const li = document.createElement("li");

    const slotElement = document.createElement("button");
    slotElement.innerText = slot;
    if (!available) {
      slotElement.disabled = true;
    } else {
      slotElement.onclick = async (e) => {
        message.innerText = "";
        e.preventDefault();
        const logged = await whoami();
        if (!logged.authenticated) {
          message.innerText = logged.error;
          console.log(logged.error);
        } else {
          const payload = { date: booking, slot };
          const response = await fetch(`/api/fields/${fieldId}/bookings`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
            credentials: "include",
          });
          if (!response.ok) {
            const err = await response.text();
            message.innerText = err;
          } else {
            const data = await response.json();
            const { bookingId } = data;
            slotElement.disabled = true;
            message.innerText = `Successfully booked, id: ${bookingId}`;

            const deleteBooking = createDeleteBooking(
              fieldId,
              bookingId,
              slotElement
            );
            li.appendChild(deleteBooking);
          }
        }
      };
    }
    li.appendChild(slotElement);
    if (!available && me) {
      const deleteBooking = createDeleteBooking(fieldId, _id, slotElement);
      li.appendChild(deleteBooking);
    }
    bookingSlots.appendChild(li);
  });

  const contaienr = document.createElement("div");
  contaienr.append(bookingSlots, message);
  return contaienr;
};

export { generateSlots };
