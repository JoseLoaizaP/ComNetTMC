import Welcome from "/src/pages/Home.js";

const API_URL = "http://localhost:3001/api";

async function login(username) {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username })
  });
  const data = await res.json();
  console.log("Login:", data);
}

async function sendPrivate(from, to, msg) {
  const res = await fetch(`${API_URL}/message`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ from, to, msg })
  });
  const data = await res.json();
  console.log("Respuesta:", data);
}

function renderApp() {
    const app = document.getElementById("app");
    
    const welcome = Welcome();

    app.appendChild(welcome);
}

renderApp();