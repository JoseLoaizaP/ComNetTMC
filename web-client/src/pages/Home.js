import onLogin from "../services/UserService.js";
import renderUserBar from "../components/UserBar.js";

export function renderWelcome() {
  const div = document.createElement("div");
  div.classList.add("welcome");

  const input = document.createElement("input");
  input.placeholder = "Ingresa tu nombre";
  input.classList.add("input-name");

  const button = document.createElement("button");
  button.textContent = "Entrar";
  button.classList.add("btn");

  button.addEventListener("click", async () => {
    const name = input.value.trim();
    if (!name) return alert("Por favor ingresa un nombre");

    try {
      const data = await onLogin(name);
      if (data.status === "ok") {
        localStorage.setItem("username", name); // guarda el usuario
        window.location.hash = "#/home";       // navega a home
      } else {
        alert("Error al crear el usuario");
      }
    } catch (err) {
      alert(err.message);
    }
  });

  div.appendChild(input);
  div.appendChild(button);
  return div;
}

export function renderHomePage(username) {
  const app = document.getElementById("app");
  app.innerHTML = "";

  const user = { name: username };
  const userbar = renderUserBar(user);
  app.appendChild(userbar);

  const content = document.createElement("div");
  content.classList.add("home-content");
  content.textContent = `Bienvenido al mejor Wassap ${username}!`;
  app.appendChild(content);
}
