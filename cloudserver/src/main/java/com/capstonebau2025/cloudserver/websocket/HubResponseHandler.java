package com.capstonebau2025.cloudserver.websocket;

import com.capstonebau2025.cloudserver.dto.RemoteCommandResponse;
import com.capstonebau2025.cloudserver.service.RemoteCommandProcessor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.annotation.SubscribeMapping;
import org.springframework.stereotype.Controller;

@Controller
@Slf4j
@RequiredArgsConstructor
public class HubResponseHandler {

    private final RemoteCommandProcessor commandProcessor;

    @MessageMapping("/responses/{hubId}")
    public void handleHubResponse(@DestinationVariable String hubId, RemoteCommandResponse response) {
        log.info("Received response from hub {}: {}", hubId, response);
        commandProcessor.handleResponse(response);
    }

//    @SubscribeMapping("/topic/responses/{hubId}")
//    public void onSubscribe(@DestinationVariable String hubId) {
//        log.info("Subscribed to responses from hub {}", hubId);
//    }
}