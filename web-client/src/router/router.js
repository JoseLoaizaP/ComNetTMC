import { routes } from "./routes.js";

export function router() {
  const path = location.hash.slice(1) || "/";
  const app = document.getElementById("app");

  if (!app) {
    console.error("No se encontró el elemento #app");
    return;
  }

  const route = routes[path.split("/")[1] ? `/${path.split("/")[1]}` : path];

  if (route) {
    app.innerHTML = "";
    // si es /chat/usuario
    if (path.startsWith("/chat/")) {
      const contactName = path.replace("/chat/", "");
      route(app, contactName);
    } else {
      route(app);
    }
  } else {
    app.innerHTML = "<h2>404 - Página no encontrada</h2>";
  }
}

// 🔹 Escuchar cambios en la URL
window.addEventListener("hashchange", router);
// 🔹 Llamarlo al cargar
window.addEventListener("load", router);
