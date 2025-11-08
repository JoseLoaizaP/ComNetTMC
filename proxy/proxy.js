const express = require('express');
const net = require('net');
const cors = require('cors');

const socket = new net.Socket();
let connected = false;

socket.connect(12345, "127.0.0.1", () => {
    // socket.write("message from nodejs\n")
    connected = true;
})

const app = express();
app.use(cors());
const port = 3002;
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
        // Si ya existe y está conectado, reutilizar
        if (clients.has(username)) {
            const socket = clients.get(username);
            if (!socket.destroyed && socket.writable) {
                return resolve(socket);
            } else {
                // Eliminar socket muerto
                clients.delete(username);
            }
        }
        
        // Crear nueva conexión solo si no existe
        const socket = new net.Socket();
        let buffer = "";
        
        socket.connect(BACKEND_PORT, BACKEND_HOST, () => {
            console.log(`[TCP] Conectado para usuario ${username}`);
            socket.write(username + "\n");
            
            // ✅ RESOLVER INMEDIATAMENTE después de conectar
            clients.set(username, socket);
            resolve(socket);
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
    });
}
/**
 * Envía un comando TCP y espera respuesta.
 */
function sendCommand(username, command) {
    return new Promise(async (resolve, reject) => {
        try {
            const socket = await getClient(username); // ← Ya está registrado
            
            let response = "";
            let commandSent = false;

            const onData = (data) => {
                response += data.toString();
                
                // ✅ Solo capturar respuesta después de enviar el comando
                if (commandSent && (response.includes('\n') || response.includes('OK:') || response.includes('ERR:'))) {
                    socket.removeListener('data', onData);
                    console.log(`[TCP] Respuesta a comando: ${response.trim()}`);
                    resolve(response.trim());
                }
            };

            socket.on('data', onData);
            
            // ✅ Marcar que el comando se envió y esperar respuesta
            commandSent = true;
            socket.write(command + "\n");
            
            // Timeout para el comando
            setTimeout(() => {
                if (commandSent) {
                    socket.removeListener('data', onData);
                    resolve("Timeout: no response from command");
                }
            }, 5000);

        } catch (err) {
            reject(err);
        }
    });
}

/* ========== ENDPOINTS HTTP ========== */

// login
app.post("/api/login", async (req, res) => {
    const { username } = req.body;
    if (!username) return res.status(400).json({ error: "Username requerido" });
    
    try {
    await getClient(username);
    console.log(`[HTTP] Usuario ${username} conectado`);
    res.json({
      status: "ok",
      user: { name: username }
    });
  } catch (err) {
    console.error("Error en /api/login:", err);
    res.status(500).json({ error: err.message });
  }
});

// enviar mensaje privado
app.post("/api/message", async (req, res) => {
const { from, to, msg } = req.body;

  if (!from || !to || !msg) {
    return res.status(400).json({ error: "Faltan parámetros (from, to, msg)" });
  }

  try {
    const socket = clients.get(from);

    if (!socket) {
      return res.status(400).json({ error: `El usuario ${from} no está conectado.` });
    }

    // Enviar el mensaje al servidor TCP
    socket.write(`/msg ${to} ${msg}\n`);
    console.log(`[HTTP] ${from} → ${to}: ${msg}`);

    res.json({ status: "ok", sent: true });
  } catch (err) {
    console.error("Error en /api/send:", err);
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

// obtener lista de usuarios conectados
app.get("/api/users", (req, res) => {
  try {
    const users = Array.from(clients.keys()); // nombres de usuario conectados
    res.json(users.map((u) => ({ username: u })));
  } catch (err) {
    console.error("Error en /api/users:", err);
    res.status(500).json({ error: "No se pudieron obtener los usuarios" });
  }
});


app.listen(port, () => {
    console.log(`API server running at http://localhost:${port}`);
});
