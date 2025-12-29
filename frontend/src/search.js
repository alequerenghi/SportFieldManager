import { fieldDetails } from "./fields.js";

const search = async (query) => {
  const fields = await fetch(`/api/fields?q=${query}`);
  return await fields.json();
};

export const mainPage = async (query) => {
  const dataContainer = document.createElement("div");
  const title = document.createElement("h2");
  title.innerText = "Fields";
  const fieldsList = document.createElement("ul");
  const someFields = await search(query);

  if (someFields) {
    for (const fieldData of someFields) {
      const fieldLink = document.createElement("a");
      const { _id, name } = fieldData;
      fieldLink.innerText = name;
      fieldLink.href = "#"; // or fieldLink.href = `/api/fields/${_id}`;

      fieldLink.addEventListener("click", async (e) => {
        e.preventDefault();
        await fieldDetails(dataContainer, _id);
      });

      const element = document.createElement("li");
      element.appendChild(fieldLink);
      fieldsList.appendChild(element);
    }
  }

  dataContainer.append(title, fieldsList);
  return dataContainer;
};
