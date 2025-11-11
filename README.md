**Instrucciones para ejecutar el sistema**
---

Ejecutar el servidor backend (proyecto Wasap) con el siguiente comando:
java -cp out TCPServer
Este paso inicializa el servidor principal que maneja las conexiones, usuarios, grupos y llamadas.

Iniciar el proxy:
cd proxy
node proxy.js
El proxy actúa como intermediario entre el cliente web y el backend, gestionando las peticiones del cliente y manteniendo la comunicación con el servidor TCP del backend.

Ejecutar el cliente web:
npx serve web-client
Este comando inicia la aplicación web desde el navegador, permitiendo a los usuarios interactuar con el sistema.

Primero se ve la pantalla del login, donde al escribir un nombre se genera un usuario. Si se regresa y se escribe un nombre diferente, se creará otro usuario distinto.
Desde el usuario 1 se pueden ver todos los usuarios existentes, excepto a sí mismo.
Para hablar directamente con alguien, solo se debe hacer clic en el nombre de la persona deseada, lo que llevará al chat personal.

En cuanto a los chats grupales, al presionar el botón “Grupos” se mostrarán todos los grupos existentes (si los hay).
El sistema también permite crear nuevos grupos y, cuando ya existen, añadir personas a ellos.

**Descripción del flujo de comunicación entre cliente, proxy y backend**
---

El sistema está compuesto por tres subproyectos: web-client, proxy y backend (Wasap). Cada uno cumple un rol específico dentro del flujo de comunicación.

- Cliente (web-client)

    El cliente es una aplicación web que permite al usuario iniciar sesión, crear o unirse a grupos, enviar mensajes privados o grupales y participar en llamadas de voz.
    Cuando el usuario realiza cualquiera de estas acciones, el front-end no se comunica directamente con el backend, sino que envía solicitudes HTTP al proxy, que corre en el puerto 3002.
    Por ejemplo, las peticiones pueden ser del tipo http://localhost:3002/api/message
     o http://localhost:3002/api/groups
    .
    Estas solicitudes son gestionadas por funciones JavaScript que usan fetch() para comunicarse con el proxy.

- Proxy (proxy.js)

    El proxy es el intermediario entre el cliente web y el servidor TCP.
    Su función principal es recibir las peticiones HTTP del cliente, convertirlas en comandos de texto y reenviarlas al backend a través de una conexión TCP persistente.
    Podemos verlo como un traductor entre el cliente (que usa JSON y HTTP) y el backend (que usa comandos de texto y sockets TCP).

    Ejemplo de funcionamiento:

    - Cuando el usuario inicia sesión desde la web, el cliente envía una solicitud POST /api/login con el nombre de usuario en formato JSON.
    El proxy recibe esta petición, la convierte en un comando de texto y la envía al backend como “/login Laura”.

    - Si el usuario envía un mensaje privado, el cliente envía algo como:
        POST /api/message con los campos “from: Jose”, “to: Juan” y “msg: Hola, ¿cómo estás?”.
        El proxy traduce esto a “/msg Jose Juan Hola, ¿cómo estás?” y lo reenvía al backend.

    - Para crear o unirse a grupos ocurre algo similar:
        La creación se traduce en “/create Jose Equipo1”, y unirse en “/join Jose Equipo1”.

    - Cuando el backend responde (por ejemplo, “User registered: Jose” o “Message sent to Equipo1”), el proxy intercepta esa respuesta, la interpreta y la reenvía al cliente en formato JSON, lista para mostrarse en la interfaz web.

    - Además de traducir mensajes, el proxy también:

    - Mantiene la conexión TCP abierta con el backend.

    - Administra las sesiones de los usuarios conectados.

    - Maneja errores de conexión y reconexión automática.

    - Envía notificaciones al cliente cuando llegan nuevos mensajes o eventos.

    -Permite que la comunicación sea en tiempo real sin que el cliente conozca los detalles del protocolo TCP.

En resumen, el proxy convierte mensajes JSON en comandos TCP, y respuestas TCP en JSON, funcionando como un traductor bidireccional.

- Backend (Wasap)

    El backend es el núcleo lógico del sistema.
    Sus principales componentes son:

    - TCPServer: acepta las conexiones entrantes del proxy y crea un manejador de cliente para cada conexión (ClientHandler).

    - ClientHandler: interpreta los comandos recibidos como /msg, /join, /create, /call, entre otros, y ejecuta las acciones correspondientes.

    - GroupManager: gestiona los usuarios, los grupos y las llamadas activas. Se encarga de enviar mensajes privados o grupales, registrar usuarios, crear grupos y manejar la lógica de llamadas.

    - UserSession: representa la conexión activa de cada usuario, guardando su nombre, flujo de salida TCP, dirección UDP y estado de llamada.

Cuando el backend recibe un comando del proxy, como “/msg Jose Juan Hola”, ejecuta la lógica de envío y reenvía el mensaje al destinatario correspondiente.
Si se trata de un mensaje grupal, GroupManager distribuye el texto a todos los miembros del grupo excepto al remitente.

Integrantes del grupo
---

- José David Loaiza
- Laura Buitrago
- Juan Pablo Bello
