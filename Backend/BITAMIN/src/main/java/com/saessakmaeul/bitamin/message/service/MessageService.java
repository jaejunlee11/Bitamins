package com.saessakmaeul.bitamin.message.service;

import com.saessakmaeul.bitamin.member.entity.Member;
import com.saessakmaeul.bitamin.member.repository.MemberRepository;
import com.saessakmaeul.bitamin.message.dto.responseDto.MessageSimpleResponse;
import com.saessakmaeul.bitamin.message.entity.Message;
import com.saessakmaeul.bitamin.message.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;

@Service
public class MessageService {
    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private MemberRepository memberRepository;

    public List<MessageSimpleResponse> getAllMessages(long userId) throws Exception{
        List<MessageSimpleResponse> result = new ArrayList<>();
        // 내가 수신자인 경우
        List<Message> messages = messageRepository.findByRecieverId(userId);
        for (Message message : messages) {
            if(message.getIsDeleted()==2) continue;
            Member member = memberRepository.findById(message.getSenderId()).orElseThrow(Exception::new);
            MessageSimpleResponse dto = MessageSimpleResponse.builder()
                    .id(message.getId())
                    .nickname(member.getNickname())
                    .category(message.getCategory())
                    .title(message.getTitle())
                    .sendDate(message.getSendDate())
                    .isRead(message.getIsRead())
                    .build();
            result.add(dto);
        }

        // 내가 송신자인 경우
        messages = messageRepository.findBySenderId(userId);
        for (Message message : messages) {
            if(message.getIsDeleted()==1) continue;
            Member member = memberRepository.findById(message.getRecieverId()).orElseThrow(Exception::new);
            MessageSimpleResponse dto = MessageSimpleResponse.builder()
                    .id(message.getId())
                    .nickname(member.getNickname())
                    .category(message.getCategory())
                    .title(message.getTitle())
                    .sendDate(message.getSendDate())
                    .isRead(message.getIsRead())
                    .build();
            result.add(dto);
        }
        Collections.sort(result,(o1,o2)->o2.getSendDate().compareTo(o1.getSendDate()));
        return result;
    }
}
