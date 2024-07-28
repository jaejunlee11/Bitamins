package com.saessakmaeul.bitamin.consultations.controller;

import com.saessakmaeul.bitamin.consultations.dto.request.SendMessageRequest;
import com.saessakmaeul.bitamin.consultations.service.ConsultationService;
import com.saessakmaeul.bitamin.util.JwtUtil;
import io.openvidu.java.client.OpenVidu;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.time.LocalDateTime;

@Controller
@RequiredArgsConstructor
public class WebSocketController {
//    private final ConsultationService consultationService;
    private final JwtUtil jwtUtil;
//    private final SimpMessagingTemplate messagingTemplate;
//    private final OpenVidu openVidu;

    @MessageMapping("/messages/{consultationId}")
    @SendTo("/topic/{consultationId}")
    public SendMessageRequest sendMessage(@Header(value = "Authorization", required = false) String tokenHeader,
                                          @DestinationVariable Long consultationId,
                                          SendMessageRequest sendMessageRequest) {
        sendMessageRequest.setMemberNickname(jwtUtil.extractNickname(tokenHeader.substring(7)));
        sendMessageRequest.setSendTime(LocalDateTime.now());

//        System.out.println(sendMessageRequest.getContent());

        // 메시지를 해당 방으로 브로드캐스트
        return sendMessageRequest;
    }
}
