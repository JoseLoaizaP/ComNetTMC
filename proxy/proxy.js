import express from "express";
import net from "net";

const app = express();
app.use(express.json());

const BACKEND_HOST = "localhost";
const BACKEND_PORT = 12345;

// Mapa de usuarios conectados al backend TCP
const clients = new Map();

/**
 * Abre (o reutiliza) una conexión TCP al backend.
 */
function getClient(username) {
    return new Promise((resolve, reject) => {
        if (clients.has(username)) return resolve(clients.get(username));
        
        const socket = new net.Socket();
        let buffer = "";
        
        socket.connect(BACKEND_PORT, BACKEND_HOST, () => {
            console.log(`[TCP] Conectado para usuario ${username}`);
            socket.write(username + "\n"); // el servidor pide el nombre al inicio
        });
    
        socket.on("data", (data) => {
            buffer += data.toString();
            if (buffer.endsWith("\n")) {
            console.log(`[TCP][${username}]`, buffer.trim());
            buffer = "";
            }
        });
    
        socket.on("error", (err) => {
            console.error(`[TCP][${username}] Error:`, err.message);
            clients.delete(username);
            reject(err);
        });
    
        socket.on("close", () => {
            console.log(`[TCP][${username}] Desconectado`);
            clients.delete(username);
        });
    
        clients.set(username, socket);
        resolve(socket);
    });
}

/**
 * Envía un comando TCP y espera respuesta.
 */
function sendCommand(username, command) {
    return new Promise(async (resolve, reject) => {
        const socket = await getClient(username);
        let response = "";

        socket.once("data", (data) => {
        response = data.toString();
            resolve(response.trim());
        });

        socket.write(command + "\n");
    });
}

/* ========== ENDPOINTS HTTP ========== */

// login
app.post("/api/login", async (req, res) => {
    const { username } = req.body;
    if (!username) return res.status(400).json({ error: "Username requerido" });
    
    try {
        await getClient(username);
        res.json({ status: "ok", message: `Usuario ${username} conectado.` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// enviar mensaje privado
app.post("/api/message", async (req, res) => {
  const { from, to, msg } = req.body;
  if (!from || !to || !msg) return res.status(400).json({ error: "Faltan parámetros" });

  try {
    const response = await sendCommand(from, `/msg ${to} ${msg}`);
    res.json({ ok: true, response });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// crear grupo
app.post("/api/create", async (req, res) => {
  const { from, group } = req.body;
  if (!from || !group) return res.status(400).json({ error: "Faltan parámetros" });

  try {
    const response = await sendCommand(from, `/create ${group}`);
    res.json({ ok: true, response });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// unirse a grupo
app.post("/api/join", async (req, res) => {
  const { from, group } = req.body;
  if (!from || !group) return res.status(400).json({ error: "Faltan parámetros" });

  try {
    const response = await sendCommand(from, `/join ${group}`);
    res.json({ ok: true, response });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// enviar mensaje grupal
app.post("/api/group", async (req, res) => {
  const { from, group, msg } = req.body;
  if (!from || !group || !msg) return res.status(400).json({ error: "Faltan parámetros" });

  try {
    const response = await sendCommand(from, `/group ${group} ${msg}`);
    res.json({ ok: true, response });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Proxy HTTP corriendo en http://localhost:${PORT}`));
