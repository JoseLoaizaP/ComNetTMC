package client;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.io.IOException;
import java.net.Socket;

public class TCPClient {

    private static final int PORT = 12345;
    private static int myLocalCallPort = -1; // se setea con /call

    public static void main(String[] args) {
        try {
            Socket socket = new Socket("localhost", PORT);
            System.out.println("Connected to server on port " + PORT);

            BufferedReader userInput = new BufferedReader(new InputStreamReader(System.in));
            BufferedReader in = new BufferedReader(new InputStreamReader(socket.getInputStream()));
            PrintWriter out = new PrintWriter(socket.getOutputStream(), true);

            // ---- Hilo para escuchar mensajes del servidor ----
            Thread listener = new Thread(() -> {
                try {
                    String line;
                    while ((line = in.readLine()) != null) {
                        System.out.println(line);

                        // 🚨 Detectar llamadas entrantes
                        if (line.startsWith("Incoming call from")) {
                            try {
                                // Mensaje tipo: "Incoming call from pepe at /192.168.0.15:6000"
                                String[] parts = line.split("at /");
                                String[] addrParts = parts[1].split(":");

                                String remoteIP = addrParts[0];
                                int remotePort = Integer.parseInt(addrParts[1]);

                                if (myLocalCallPort > 0) {
                                    int localPort = myLocalCallPort;

                                    System.out.println(" Iniciando llamada con " + remoteIP + ":" + remotePort);
                                    new Thread(() -> {
                                        UDPClient.startCall(remoteIP, remotePort, localPort);
                                    }).start();
                                } else {
                                    System.out.println(" No has configurado tu puerto local con /call <puerto>");
                                }

                            } catch (Exception e) {
                                e.printStackTrace();
                            }
                        }
                        else if (line.startsWith("Calling ")) {
                            // Mensaje tipo: "Calling jose at /127.0.0.1:5000"
                            try {
                                String[] parts = line.split("at /");
                                String[] addrParts = parts[1].split(":");
                            
                                String remoteIP = addrParts[0];
                                int remotePort = Integer.parseInt(addrParts[1]);
                            
                                // Usar el puerto local que registraste con /call
                                int localPort = myLocalCallPort;
                            
                                System.out.println("Iniciando llamada con " + remoteIP + ":" + remotePort);
                            
                                new Thread(() -> {
                                    UDPClient.startCall(remoteIP, remotePort, localPort);
                                }).start();
                            
                            } catch (Exception e) {
                                e.printStackTrace();
                            }
                        }
                    }
                } catch (IOException e) {
                    System.out.println("Disconnected from server.");
                }
            });
            listener.start();

            // ---- Hilo para escribir ----
            while (true) {
                System.out.print("Enter message: ");
                String message = userInput.readLine();
                if (message == null || message.equalsIgnoreCase("exit")) {
                    break;
                }

                if (message.startsWith("/call ")) {
                    // Guardar el puerto local de llamadas
                    try {
                        String[] parts = message.split(" ");
                        myLocalCallPort = Integer.parseInt(parts[1]);
                        System.out.println("Registrado localPort = " + myLocalCallPort);
                    } catch (NumberFormatException e) {
                        System.out.println("Uso correcto: /call <puerto>");
                        continue;
                    }
                }

                out.println(message); // enviar al servidor
            }

            socket.close();
            in.close();
            out.close();
            userInput.close();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            System.out.println("Client terminated.");
        }
    }
}
