import { renderWelcome, renderHomePage } from "../pages/Home.js";

export const routes = {
  "/": (app) => app.appendChild(renderWelcome()),

  "/home": (app) => {
    const username = localStorage.getItem("username") || "Invitado";
    renderHomePage(username);
  },
};
