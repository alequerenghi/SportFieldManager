import { mainPage } from "./search.js";

const submitForm = async (path, data, options = {}) => {
  return await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    ...options,
  });
};

const loginPage = (app) => {
  // SHOW LOGIN PAGE
  app.innerHTML = "";
  const header = document.createElement("h1");
  header.innerText = "Login";

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

  const form = document.createElement("form");
  form.append(username, password, submit);

  const message = document.createElement("p");
  app.append(header, form, message);
  form.addEventListener(
    "submit",
    async (e) => {
      e.preventDefault();
      const payload = {
        username: username.value,
        password: password.value,
      };
      const response = await submitForm("/api/auth/signin", payload, {
        credentials: "include",
      });
      console.log(response);
      if (!response.ok) {
        const parsed = await response.json();
        const { error } = parsed;
        message.innerText = error;
      } else {
        const nav = await navbar(app);
        const searchResult = await mainPage("");
        app.innerHTML = "";
        app.append(nav, searchResult);
      }
    },
    false
  );
};

const registerPage = (app) => {
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
  });
};

const whoami = async () => {
  const response = await fetch("/api/whoami", { credentials: "include" });
  if (response.ok) {
    return await response.json();
  }
};

const navbar = async (app) => {
  const nav = document.createElement("nav");
  const userInfo = await whoami();
  if (!userInfo) {
    const login = document.createElement("button");
    const signup = document.createElement("button");
    login.innerText = "Login";
    signup.innerText = "Signup";
    login.addEventListener("click", (e) => loginPage(app));
    signup.addEventListener("click", (e) => registerPage(app));
    nav.append(login, signup);
  } else {
    const logoutButton = document.createElement("button");
    logoutButton.innerText = "Logout";
    logoutButton.onclick = async (e) => {
      e.preventDefault();
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      if (response.ok) {
        app.innerHTML = "";
        const nav = await navbar(app);
        const main = await mainPage("");
        app.append(nav, main);
      }
    };
    const { username } = userInfo;
    const userButton = document.createElement("button");
    userButton.innerText = username;
    // userButton.onclick = () => {
    //   app.innerHTML = "";
    //   const header = document.createElement("h1");
    //   header.innerText = username;

    //   const bookings = document.createElement("a");
    //   bookings.innerText = "Bookings";
    // };
    nav.append(logoutButton, userButton);
  }
  return nav;
};

export default navbar;
export { whoami };
