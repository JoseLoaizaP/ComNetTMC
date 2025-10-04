package server;

import java.net.InetAddress;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class TCPServer {

    private static final int PORT = 12345;
    private static final int THREAD_POOL_SIZE = 10;
    

    public static void main(String[] args) {
        ExecutorService pool = Executors.newFixedThreadPool
        (THREAD_POOL_SIZE);
         GroupManager groupManager = new GroupManager();

        try(ServerSocket server = new ServerSocket(PORT, 50, InetAddress.getByName("localhost"))) {
            System.out.println("Server is running...");

            while (true) {
                Socket clientSocket = server.accept();
                pool.submit(new ClientHandler(clientSocket, groupManager));
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            pool.shutdown();
        }
    }

}
