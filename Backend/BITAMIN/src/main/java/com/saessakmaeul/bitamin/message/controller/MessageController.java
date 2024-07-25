package com.saessakmaeul.bitamin.message.controller;

import com.saessakmaeul.bitamin.message.dto.requestDto.MessageRegistRequest;
import com.saessakmaeul.bitamin.message.dto.responseDto.MessageDetailResponse;
import com.saessakmaeul.bitamin.message.dto.responseDto.MessageSimpleResponse;
import com.saessakmaeul.bitamin.message.service.MessageService;
import com.saessakmaeul.bitamin.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/messages")
public class MessageController {
    @Autowired
    private MessageService messageService;

    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping("")
    public ResponseEntity<?> getAllMessages(@RequestHeader(name = "Authorization",required = false) String token) {
        try {
            long userId = jwtUtil.extractUserId(token.substring(7));
            List<MessageSimpleResponse> messages = messageService.getAllMessages(userId);
            return ResponseEntity.ok(messages);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getMessageDetails(@PathVariable("id") long id, @RequestHeader(name = "Authorization",required = false) String token) {
        try {
            long userId = jwtUtil.extractUserId(token.substring(7));
            MessageDetailResponse messages = messageService.getMessageDetail(id,userId);
            return ResponseEntity.ok(messages);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("")
    public ResponseEntity<?> postMessage(@RequestBody MessageRegistRequest request, @RequestHeader(name = "Authorization",required = false) String token) {
        try{
            long userId = jwtUtil.extractUserId(token.substring(7));
            messageService.registMessage(request,userId);
            return ResponseEntity.ok().build();
        } catch (Exception e){
            e.printStackTrace();
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
