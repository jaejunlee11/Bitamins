package com.saessakmaeul.bitamin.consultations.controller;

import com.saessakmaeul.bitamin.consultations.dto.request.SendMessageRequest;
import com.saessakmaeul.bitamin.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.time.LocalDateTime;

@Controller
@RequiredArgsConstructor
public class WebSocketController {
    private final JwtUtil jwtUtil;
    private final SimpMessagingTemplate simpMessagingTemplate;

    @MessageMapping("/messages/{consultationId}")
    public void sendMessage(@Header(value = "Authorization", required = false) String tokenHeader,
                            @DestinationVariable("consultationId") Long consultationId,
                            SendMessageRequest sendMessageRequest) {

        sendMessageRequest.setMemberNickname(jwtUtil.extractNickname(tokenHeader.substring(7)));
        System.out.println(sendMessageRequest.getMemberNickname());
        sendMessageRequest.setSendTime(LocalDateTime.now());

        // 메시지를 해당 방으로 브로드캐스트
        simpMessagingTemplate.convertAndSend("/sub/messages/" + consultationId, sendMessageRequest);
    }
}
