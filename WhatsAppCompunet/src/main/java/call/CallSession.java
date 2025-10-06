
package call;

import java.net.SocketAddress;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

/**
 * Representa una llamada activa entre uno o más clientes.
 */
public class CallSession {

    private final String sessionId;
    private final Set<SocketAddress> participants;
    private boolean active;

    public CallSession() {
        this.sessionId = UUID.randomUUID().toString(); // ID único de la llamada
        this.participants = new HashSet<>();
        this.active = true;
    }

    public String getSessionId() {
        return sessionId;
    }

    public boolean isActive() {
        return active;
    }

    public void endSession() {
        this.active = false;
    }

    public void addParticipant(SocketAddress address) {
        participants.add(address);
    }

    public void removeParticipant(SocketAddress address) {
        participants.remove(address);
    }

    public Set<SocketAddress> getParticipants() {
        return participants;
    }
}

