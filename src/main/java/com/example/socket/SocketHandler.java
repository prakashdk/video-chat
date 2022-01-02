package com.example.socket;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CopyOnWriteArrayList;

import com.example.model.Message;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

@Component
public class SocketHandler extends TextWebSocketHandler {

    List<WebSocketSession> sessions = new CopyOnWriteArrayList<>();
    Map<String, String> map = new HashMap<String, String>();

    @Override
    public void handleTextMessage(WebSocketSession session, TextMessage message)
            throws InterruptedException, IOException {
        String id = session.getId();
        String messageText = message.getPayload();
        if (!map.containsKey(id)) {
            map.put(id, messageText);
            sendMessage(session, new TextMessage(messageText + " Joined"));

        } else {
            TextMessage newMessage = new TextMessage(
                    new Message(map.get(id), messageText).toString());
            sendMessage(session, newMessage);

        }

    }

    public void sendMessage(WebSocketSession session, TextMessage message) throws InterruptedException, IOException {
        for (WebSocketSession webSocketSession : sessions) {
            if (webSocketSession.isOpen() && !session.getId().equals(webSocketSession.getId())) {

                webSocketSession.sendMessage(message);
            }
        }
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {

        System.out.println(session.getId());
        sessions.add(session);
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        System.out.println(status);
        sessions.remove(session);

        TextMessage newMessage = new TextMessage(
                map.get(session.getId()) + " left");
        sendMessage(session, newMessage);
        map.remove(session.getId());
    }

}