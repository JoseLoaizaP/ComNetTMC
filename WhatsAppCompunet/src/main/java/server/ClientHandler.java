package server;

import java.io.*;
import java.net.Socket;

public class ClientHandler implements Runnable {

    private final Socket socket;
    private final GroupManager manager;
    private String username;

    public ClientHandler(Socket socket, GroupManager manager) {
        this.socket = socket;
        this.manager = manager;
    }

    @Override
    public void run() {
        try (
            BufferedReader in = new BufferedReader(new InputStreamReader(socket.getInputStream()));
            PrintWriter out = new PrintWriter(socket.getOutputStream(), true)
        ) {
            out.println("Welcome! Enter your username:");
            username = in.readLine();
            manager.registerUser(username, out);
            out.println("You are now connected. Use commands like:");
            out.println("/msg <user> <message>");
            out.println("/group <group> <message>");
            out.println("/join <group>");
            out.println("/create <group>");

            String line;
            while ((line = in.readLine()) != null) {
                if (line.startsWith("/msg ")) {
                    String[] parts = line.split(" ", 3);
                    if (parts.length >= 3)
                        manager.sendPrivateMessage(username, parts[1], parts[2]);
                } else if (line.startsWith("/create ")) {
                    manager.createGroup(line.split(" ", 2)[1]);
                } else if (line.startsWith("/join ")) {
                    manager.addUserToGroup(line.split(" ", 2)[1], username);
                } else if (line.startsWith("/group ")) {
                    String[] parts = line.split(" ", 3);
                    if (parts.length >= 3)
                        manager.sendGroupMessage(username, parts[1], parts[2]);
                } else {
                    out.println("Unknown command.");
                }
            }

        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            manager.removeUser(username);
            try { socket.close(); } catch (IOException ignored) {}
        }
    }
}
