package server;

import java.io.PrintWriter;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

public class GroupManager {
    // usuario -> flujo de salida
    private final Map<String, PrintWriter> clients = new ConcurrentHashMap<>();
    // grupo -> lista de miembros
    private final Map<String, Set<String>> groups = new ConcurrentHashMap<>();

    public GroupManager() {
    }

    public void registerUser(String username, PrintWriter out) {
        clients.put(username, out);
        System.out.println("User registered: " + username);
    }

    public void removeUser(String username) {
        clients.remove(username);
        groups.values().forEach(g -> g.remove(username));
        System.out.println("User removed: " + username);
    }

    public void createGroup(String groupName) {
        groups.putIfAbsent(groupName, ConcurrentHashMap.newKeySet());
        System.out.println("Group created: " + groupName);
    }

    public void addUserToGroup(String groupName, String username) {
        groups.putIfAbsent(groupName, ConcurrentHashMap.newKeySet());
        groups.get(groupName).add(username);
        System.out.println("User " + username + " joined group " + groupName);
    }

    public void sendPrivateMessage(String from, String to, String message) {
        PrintWriter recipient = clients.get(to);
        if (recipient != null) {
            recipient.println("[Private from " + from + "]: " + message);
        } else {
            PrintWriter sender = clients.get(from);
            if (sender != null) {
                sender.println("User " + to + " not found.");
            }
        }
    }

    public void sendGroupMessage(String from, String group, String message) {
        Set<String> members = groups.get(group);
        if (members == null) return;

        for (String user : members) {
            if (!user.equals(from)) {
                PrintWriter out = clients.get(user);
                if (out != null) {
                    out.println("[" + group + "] " + from + ": " + message);
                }
            }
        }
    }
}
