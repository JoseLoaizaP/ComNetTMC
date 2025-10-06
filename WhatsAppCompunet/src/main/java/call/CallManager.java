package call;

import java.net.SocketAddress;
import java.util.HashMap;
import java.util.Map;

/**
 * Administra todas las llamadas activas en el servidor.
 */
public class CallManager {

    private final Map<String, CallSession> activeCalls;

    public CallManager() {
        this.activeCalls = new HashMap<>();
    }

    // Crear una nueva llamada entre dos usuarios
    public CallSession createCall(SocketAddress initiator, SocketAddress receiver) {
        CallSession session = new CallSession();
        session.addParticipant(initiator);
        session.addParticipant(receiver);
        activeCalls.put(session.getSessionId(), session);
        return session;
    }

    // Terminar una llamada
    public void endCall(String sessionId) {
        CallSession session = activeCalls.get(sessionId);
        if (session != null) {
            session.endSession();
            activeCalls.remove(sessionId);
        }
    }

    // Buscar llamada en la que participa un usuario
    public CallSession findCallByParticipant(SocketAddress participant) {
        for (CallSession session : activeCalls.values()) {
            if (session.getParticipants().contains(participant) && session.isActive()) {
                return session;
            }
        }
        return null;
    }

    // Obtener todas las llamadas activas
    public Map<String, CallSession> getActiveCalls() {
        return activeCalls;
    }
}

