const app = document.getElementById("app");

const login = document.createElement("button");
login.innerText = "Login";

login.addEventListener("click", async () => {
  // SHOW LOGIN PAGE
  const header = document.createElement("h1");
  header.innerText = "Login";
  const username = document.createElement("input");
  username.type = "text";
  const password = document.createElement("input");
  password.type = "password";
  const submit = document.createElement("button");
  submit.innerText = "Login";
  submit.type = "submit";
  app.innerHTML = "";
  app.append(header, username, password, submit);
  submit.addEventListener("click", async () => {
    const payload = {
      username: username.innerText,
      password: password.innerText,
    };
    console.log(JSON.stringify(payload));
    const response = await fetch("/api/auth/signin", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    console.log(payload);
    const parsed = await response.json();
    const loginStatus = document.createElement("p");
    loginStatus.innerText = parsed;
    app.appendChild(loginStatus);
    console.log(response);
  });
});

app.appendChild(login);
