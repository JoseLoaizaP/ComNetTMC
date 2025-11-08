import { renderWelcome, renderHomePage } from "../pages/Home.js";
import { renderChatPage } from "../pages/chat.js";

export const routes = {
  "/": (app) => app.appendChild(renderWelcome()),

  "/home": (app) => {
    const username = localStorage.getItem("username") || "Invitado";
    renderHomePage(username);
  },

  "/chat": (app, contactName) => {
    const username = localStorage.getItem("username");
    if (!username) {
      window.location.hash = "#/";
      return;
    }
    renderChatPage(username, contactName); // ✅ correcto si renderChatPage obtiene el elemento por su cuenta
  },
};
