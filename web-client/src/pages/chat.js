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

  // Campo de texto
  const input = document.createElement("input");
  input.placeholder = "Escribe un mensaje...";
  input.classList.add("chat-input");

  // Botón enviar
  const sendBtn = document.createElement("button");
  sendBtn.textContent = "Enviar";
  sendBtn.classList.add("chat-send");

  sendBtn.addEventListener("click", async () => {
    const msg = input.value.trim();
    if (!msg) return;
    console.log("DEBUG username:", username);
    console.log("DEBUG contact:", contact);


    try {
      
      await sendMessage(username, contact, msg);

      const msgDiv = document.createElement("div");
      msgDiv.classList.add("msg", "sent");
      msgDiv.textContent = msg;
      messagesDiv.appendChild(msgDiv);
      input.value = "";
    } catch (err) {
      console.error("Error enviando mensaje:", err);
      alert("No se pudo enviar el mensaje.");
    }
  });

  chatContainer.appendChild(input);
  chatContainer.appendChild(sendBtn);

  app.appendChild(chatContainer);
};

