
import onLogin from "./src/services/UserService.js";
import renderUserBar from "./src/components/UserBar.js";

const API_URL = "http://localhost:3001/api";

function Welcome() {
  const div = document.createElement("div");
  div.classList.add("welcome");

  const input = document.createElement("input");
  input.placeholder = "Ingresa tu nombre";
  input.classList.add("input-name");

  const button = document.createElement("button");
  button.textContent = "Entrar";
  button.classList.add("btn");

  button.addEventListener("click", () => {
    const name = input.value.trim();
    if (name) {
      onLogin(name);
    } else {
      alert("Por favor ingresa un nombre");
    }
  });

  div.appendChild(input);
  div.appendChild(button);
  return div;
}

function renderHomePage(username) {
  const app = document.getElementById("app");
  app.innerHTML = "";
  const user = {name : username};
  const userbar = renderUserBar(user);
  app.appendChild(userbar);

  const content = document.createElement("div");
  content.classList.add("home-content");
  content.textContent = `Bienvenido al mejor Wassap ${username}!`;
  app.appendChild(content);
}

function renderApp() {
    const app = document.getElementById("app");
  app.innerHTML = "";
  const welcome = Welcome();
  const texto = document.createElement("span");
  app.appendChild(welcome);

}

renderApp();