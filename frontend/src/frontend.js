import navbar from "./auth.js";
import { mainPage } from "./search.js";

const app = document.getElementById("app");
const nav = await navbar(app);
const searchBar = document.createElement("input");
searchBar.type = "search";
const searchResulst = document.createElement("div");
const searchButton = document.createElement("button");
searchButton.type = "submit";
searchButton.innerText = "Search";

searchButton.addEventListener("click", async () => {
  const results = await mainPage(searchBar.value);
  searchResulst.innerHTML = "";
  searchResulst.appendChild(results);
});

const search = document.createElement("div");
search.append(searchBar, searchButton, searchResulst);

app.append(nav, search);

const initialResults = await mainPage("");
searchResulst.appendChild(initialResults);
