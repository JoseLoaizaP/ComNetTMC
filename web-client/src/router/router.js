import { routes } from "./routes.js";

export function router() {
  const path = location.hash.slice(1) || "/"; // ruta actual (#/home, #/, etc.)
  const route = routes[path];
  const app = document.getElementById("app");

  if (!app) {
    console.error("No se encontró el elemento #app");
    return;
  }

  if (route) {
    app.innerHTML = "";     // Limpia el contenedor
    route(app);             // Renderiza la vista
  } else {
    app.innerHTML = "<h2>404 - Página no encontrada</h2>";
  }
}
