package com.saessakmaeul.bitamin.consultation.controller;

import com.saessakmaeul.bitamin.consultation.dto.request.ChatCompletion;
import com.saessakmaeul.bitamin.consultation.dto.request.ChatRequestMsg;
import com.saessakmaeul.bitamin.consultation.service.GptService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/gpt")
@RequiredArgsConstructor
public class GptController {

    private final GptService GptService;

    @PostMapping("/prompt")
    public ResponseEntity<String> selectPrompt(@RequestBody ChatCompletion chatCompletion) {
        
    	chatCompletion.setModel("gpt-4o");
    	
        for(ChatRequestMsg msg : chatCompletion.getMessages()) {
        	msg.setRole("system");
        }
        
        System.out.println("param :: " + chatCompletion.toString());
        
        String result = GptService.prompt(chatCompletion);
        return ResponseEntity.ok(result);
    }
}