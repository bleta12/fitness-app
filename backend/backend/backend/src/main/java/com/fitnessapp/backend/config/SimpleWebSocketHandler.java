package com.fitnessapp.backend.config;

import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

public class SimpleWebSocketHandler extends TextWebSocketHandler {

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        System.out.println("✅ New WebSocket connection: " + session.getId());
        // Sa herë që hapet faqja → klienti merr mesazh automatikisht
        session.sendMessage(new TextMessage("👋 Welcome! 💧 Don't forget to drink water."));
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String payload = message.getPayload();
        System.out.println("📩 Message from client: " + payload);

        if ("ping".equalsIgnoreCase(payload)) {
            session.sendMessage(new TextMessage("💧 Time to drink water!"));
        } else {
            session.sendMessage(new TextMessage("Echo: " + payload));
        }
    }
}

