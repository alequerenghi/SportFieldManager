const submitForm = async (path, data, options = {}) => {
  return await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    ...options,
  });
};

const loginPage = () => {
  // SHOW LOGIN PAGE
  app.innerHTML = "";
  const header = document.createElement("h1");
  header.innerText = "Login";

  const form = document.createElement("form");

  const username = document.createElement("input");
  username.type = "text";
  username.placeholder = "Username";
  username.required = true;

  const password = document.createElement("input");
  password.type = "password";
  password.placeholder = "Password";
  password.required = true;
  password.autocomplete = "current-password";

  const submit = document.createElement("button");
  submit.type = "submit";
  submit.innerText = "Login";

  const message = document.createElement("p");
  form.append(username, password, submit);
  app.append(header, form, message);
  form.addEventListener(
    "submit",
    async (e) => {
      e.preventDefault();
      const payload = {
        username: username.value,
        password: password.value,
      };
      const response = await submitForm(
        "/api/auth/signin",
        payload,
        (options = { credentials: "include" })
      );
      if (response.ok) {
        window.location.href = "/index.html";
      }
      const parsed = await response.json();
      const { error } = parsed;
      message.innerText = error;
    },
    false
  );
};

const registerPage = () => {
  const name = document.createElement("input");
  const surname = document.createElement("input");
  const username = document.createElement("input");
  const password = document.createElement("input");
  const header = document.createElement("h1");
  const submit = document.createElement("button");
  header.innerText = "Register";
  password.type = "password";
  submit.innerText = "Register";
  app.innerHTML = "";
  app.append(header, username, name, surname, password, submit);
  submit.addEventListener("click", async () => {
    const payload = {
      name: name.value,
      surname: surname.value,
      username: username.value,
      password: password.value,
    };
    const response = await submitForm("/api/auth/signup", payload);
    const parsed = await response.json();
    console.log(parsed);
  });
};

const search = async (query) => {
  const fields = await fetch(`/api/fields?q=${query}`);
  const data = await fields.json();
  console.log(data);
};

const app = document.getElementById("app");

const login = document.createElement("button");
const signup = document.createElement("button");
login.innerText = "Login";
signup.innerText = "Signup";
login.addEventListener("click", loginPage);
signup.addEventListener("click", registerPage);

const searchBar = document.createElement("input");
searchBar.type = "search";
search("");
app.append(login, signup, searchBar);
