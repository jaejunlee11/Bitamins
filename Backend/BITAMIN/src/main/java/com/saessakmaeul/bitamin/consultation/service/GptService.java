package com.saessakmaeul.bitamin.consultation.service;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.saessakmaeul.bitamin.config.GptConfig;
import com.saessakmaeul.bitamin.consultation.dto.request.GptCompletion;
import com.saessakmaeul.bitamin.consultation.dto.response.GptResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor
public class GptService {

    private final GptConfig gptConfig;

    @Value("${openai.model}")
    private String modelUrl;

    @Value("${openai.api.url}")
    private String promptUrl;

    public GptResponse prompt(GptCompletion gptCompletion) {
        System.out.println("[+] 신규 프롬프트를 수행합니다.");

        Map<String, Object> resultMap = new HashMap<>();

        // [STEP1] 토큰 정보가 포함된 Header를 가져옵니다.
        HttpHeaders headers = gptConfig.httpHeaders();

        // [STEP5] 통신을 위한 RestTemplate을 구성합니다.
        HttpEntity<GptCompletion> requestEntity = new HttpEntity<>(gptCompletion, headers);
        ResponseEntity<String> response = gptConfig
                .restTemplate()
                .exchange(promptUrl, HttpMethod.POST, requestEntity, String.class);
        try {
            // [STEP6] String -> HashMap 역직렬화를 구성합니다.
            ObjectMapper om = new ObjectMapper();
            resultMap = om.readValue(response.getBody(), new TypeReference<>() {
            });
            System.out.println("chatGpt resultMap 체크:"+resultMap);
        } catch (JsonProcessingException e) {
        	System.out.println("JsonMappingException :: " + e.getMessage());
        } catch (RuntimeException e) {
        	System.out.println("RuntimeException :: " + e.getMessage());
        }
        
        String text = (String)((Map)((Map)((List)resultMap.get("choices")).get(0)).get("message")).get("content");
        text = text.replace("\n", "<br />");
        text = text.replaceAll("\\*\\*(.*?)\\*\\*", "<strong>$1</strong>");

        System.out.println("text : " + text);
        
        return new GptResponse(text);
    }
}