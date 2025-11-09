import { onLogin } from "../services/UserService.js";
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
        localStorage.setItem("username", name); // ✅ guarda usuario actual
        window.location.hash = "#/home";        // ✅ navega al home
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

export async function renderHomePage(username) {
  const app = document.getElementById("app");
  app.innerHTML = "";

  // 🔹 Barra superior con nombre de usuario
  const user = { name: username };
  const userbar = renderUserBar(user);
  app.appendChild(userbar);

  // 🔹 Nav acciones rápidas (incluye botón de Grupos)
  const actions = document.createElement("div");
  actions.classList.add("home-actions");

  const btnGroups = document.createElement("button");
  btnGroups.textContent = "Grupos";
  btnGroups.classList.add("btn");
  btnGroups.addEventListener("click", () => {
    window.location.hash = "#/groups";
  });

  actions.appendChild(btnGroups);
  app.appendChild(actions);

  // 🔹 Mensaje de bienvenida
  const content = document.createElement("div");
  content.classList.add("home-content");
  content.textContent = `Bienvenido al mejor Wassap, ${username}!`;
  app.appendChild(content);

  // 🔹 Lista de usuarios conectados
  const userListDiv = document.createElement("div");
  userListDiv.classList.add("user-list");
  app.appendChild(userListDiv);

  try {
    const { data: users } = await axios.get("http://localhost:3002/api/users");

    const listTitle = document.createElement("h3");
    listTitle.textContent = "Usuarios conectados:";
    userListDiv.appendChild(listTitle);

    const ul = document.createElement("ul");

    users
      .filter((u) => u.username !== username) // ✅ no mostrar al propio usuario
      .forEach((u) => {
        const li = document.createElement("li");
        li.textContent = u.username;
        li.classList.add("user-item");

        // ✅ Redirigir al chat al hacer clic
        li.addEventListener("click", () => {
          location.hash = `#/chat/${u.username}`;
        });

        ul.appendChild(li);
      });

    if (ul.children.length === 0) {
      const emptyMsg = document.createElement("p");
      emptyMsg.textContent = "No hay otros usuarios conectados.";
      userListDiv.appendChild(emptyMsg);
    } else {
      userListDiv.appendChild(ul);
    }
  } catch (err) {
    console.error("Error al cargar usuarios:", err);
    userListDiv.textContent = "Error al obtener usuarios.";
  }
}
