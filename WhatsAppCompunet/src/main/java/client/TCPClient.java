package client;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.io.IOException;
import java.net.Socket;

public class TCPClient {
    
    private static final int PORT = 12345;
    
    public static void main(String[] args) {
        try{
            Socket socket = new Socket("localhost", PORT);
            System.out.println("Connected to server on port " + PORT);

            BufferedReader userInput = new BufferedReader(new InputStreamReader(System.in));
            BufferedReader in = new BufferedReader(new InputStreamReader(socket.getInputStream()));
            PrintWriter out = new PrintWriter(socket.getOutputStream(), true);

            //Hilo para escuchar
             Thread listener = new Thread(() -> {
                try {
                    String serverMsg;
                    while ((serverMsg = in.readLine()) != null) {
                        System.out.println(serverMsg);
                    }
                } catch (IOException e) {
                    System.out.println("Disconnected from server.");
                }
            });
            listener.start();

            //Hilo para escribir
            while (true) {
                System.out.print("Enter message: ");
                String message = userInput.readLine();
                if (message == null || message.equalsIgnoreCase("exit")) {
                    break;
                }
                out.println(message);
            }

            socket.close();
            in.close();
            out.close();
            userInput.close();
        }
        catch (Exception e) {
            e.printStackTrace();
        }
        finally {
            System.out.println("Client terminated.");
        }
    }
}
