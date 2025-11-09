import renderUserBar from "../components/UserBar.js";
import { sendMessage } from "../services/UserService.js";

export const renderChatPage = (username, contact) => {
  const app = document.getElementById("app");
  app.innerHTML = "";

  const userbar = renderUserBar({ name: username });
  app.appendChild(userbar);

  const chatContainer = document.createElement("div");
  chatContainer.classList.add("chat-container");

  const title = document.createElement("h3");
  title.textContent = `Chat con ${contact}`;
  chatContainer.appendChild(title);

  const messagesDiv = document.createElement("div");
  messagesDiv.classList.add("messages");
  chatContainer.appendChild(messagesDiv);

  // ---- util de render ----
  const append = (kind, text) => {
    const div = document.createElement("div");
    div.classList.add("msg", kind); // 'sent' | 'received' | 'system' | 'error'
    div.textContent = text;
    messagesDiv.appendChild(div);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  };

  // ===== Stream en tiempo real (SSE) por usuario =====
  // Cerramos un stream previo del mismo usuario si existía (evita streams duplicados al navegar)
  try {
    if (window.__chatSSE && window.__chatSSE.username === username) {
      try { window.__chatSSE.es.close(); } catch {}
    }
  } catch {}

  const sseUrl = `http://localhost:3002/api/stream?username=${encodeURIComponent(username)}`;
  const es = new EventSource(sseUrl);
  window.__chatSSE = { es, username };

  es.onmessage = (ev) => {
    try {
      const payload = JSON.parse(ev.data);
      if (!payload) return;
      if (payload.hello) {
        append("system", `Conectado como ${payload.hello}`);
        return;
      }
      if (payload.line) {
        // Mostramos la línea cruda del servidor para máxima compatibilidad
        append("received", payload.line);
      }
    } catch {
      // si no es JSON válido, lo ignoramos
    }
  };

  es.addEventListener("error", () => {
    append("error", "Stream desconectado. Revisa el proxy o el servidor.");
  });

  es.addEventListener("close", () => {
    append("system", "Conexión con el servidor cerrada.");
  });

  // ---- Entrada de texto ----
  const input = document.createElement("input");
  input.placeholder = "Escribe un mensaje...";
  input.classList.add("chat-input");

  const sendBtn = document.createElement("button");
  sendBtn.textContent = "Enviar";
  sendBtn.classList.add("chat-send");

  const doSend = async () => {
    const msg = input.value.trim();
    if (!msg) return;

    try {
      // Tu servicio actual: sendMessage(from, to, msg)
      await sendMessage(username, contact, msg);

      append("sent", `(a ${contact}) ${msg}`);
      input.value = "";
      input.focus();
    } catch (err) {
      console.error("Error enviando mensaje:", err);
      append("error", "No se pudo enviar el mensaje.");
    }
  };

  sendBtn.addEventListener("click", doSend);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") doSend();
  });

  chatContainer.appendChild(input);
  chatContainer.appendChild(sendBtn);

  app.appendChild(chatContainer);
};
