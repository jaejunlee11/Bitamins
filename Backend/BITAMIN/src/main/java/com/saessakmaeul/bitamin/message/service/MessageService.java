package com.saessakmaeul.bitamin.message.service;

import com.saessakmaeul.bitamin.member.entity.Member;
import com.saessakmaeul.bitamin.member.repository.MemberRepository;
import com.saessakmaeul.bitamin.message.dto.requestDto.MessageRegistRequest;
import com.saessakmaeul.bitamin.message.dto.requestDto.ReplyRegistRequest;
import com.saessakmaeul.bitamin.message.dto.responseDto.MessageDetailResponse;
import com.saessakmaeul.bitamin.message.dto.responseDto.MessageSimpleResponse;
import com.saessakmaeul.bitamin.message.dto.responseDto.Replies;
import com.saessakmaeul.bitamin.message.entity.Message;
import com.saessakmaeul.bitamin.message.entity.Reply;
import com.saessakmaeul.bitamin.message.repository.MessageRepository;
import com.saessakmaeul.bitamin.message.repository.ReplyRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;

@Service
public class MessageService {
    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private ReplyRepository replyRepository;

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

    public MessageDetailResponse getMessageDetail(long id,long userId) throws Exception{
        Message message = messageRepository.findById(id).orElseThrow(Exception::new);
        String nickname = null;
        // 유저가 송신자인 경우
        if(userId == message.getSenderId()){
            nickname = memberRepository.findById(message.getRecieverId()).orElseThrow(Exception::new).getNickname();
        }
        // 유저가 수신자인 경우
        else {
            nickname = memberRepository.findById(message.getSenderId()).orElseThrow(Exception::new).getNickname();
        }
        // 답장 조회
        List<Reply> replies = replyRepository.findByMessageId(id);

        // 답장 리스트 정제
        List<Replies> repliyList = new ArrayList<>();
        for(Reply reply : replies){
            if(reply.getIsDeleted()==1 && reply.getMemberId()==userId) continue;
            if(reply.getIsDeleted()==2 && reply.getMemberId()!=userId) continue;
            Replies temp = Replies
                    .builder()
                    .id(reply.getId())
                    .memberNickName(memberRepository.findById(reply.getMemberId()).orElseThrow(Exception::new).getNickname())
                    .content(reply.getContent())
                    .isRead(reply.getIsRead())
                    .sendDate(reply.getSendDate())
                    .build();
            repliyList.add(temp);
        }
        Collections.sort(repliyList,(o1,o2)->o2.getSendDate().compareTo(o1.getSendDate()));

        MessageDetailResponse result = MessageDetailResponse.builder()
                .id(id)
                .nickname(nickname)
                .category(message.getCategory())
                .title(message.getTitle())
                .content(message.getContent())
                .sendDate(message.getSendDate())
                .counselingDate(message.getCounselingDate())
                .isRead(message.getIsRead())
                .replies(repliyList)
                .build();
        return result;
    }

    @Transactional
    public void registMessage(MessageRegistRequest message,Long userId) throws Exception{
        Message registMessage = new Message();
        System.out.println(userId);
        System.out.println(message.getRecieverId());
        registMessage.setSenderId(userId);
        registMessage.setRecieverId(message.getRecieverId());
        registMessage.setCategory(message.getCategory());
        registMessage.setTitle(message.getTitle());
        registMessage.setContent(message.getContent());
        registMessage.setIsDeleted(0);
        registMessage.setIsRead(false);
        registMessage.setCounselingDate(message.getCounselingDate());
        registMessage.setSendDate(LocalDateTime.now());
        messageRepository.save(registMessage);
    }

    @Transactional
    public void registReply(ReplyRegistRequest reply, Long id, Long userId) throws Exception{
        Reply registReply = new Reply();
        registReply.setMessageId(id);
        registReply.setMemberId(userId);
        registReply.setContent(reply.getContent());
        registReply.setIsDeleted(0);
        registReply.setIsRead(false);
        registReply.setSendDate(LocalDateTime.now());
        replyRepository.save(registReply);
    }

    @Transactional
    public void deleteMessage(Long id, Long userId) throws Exception{
        Message message = messageRepository.findById(id).orElseThrow(Exception::new);
        // user가 sender 인 경우 2이면 제거, 0이면 1로 변경
        if(message.getSenderId() == userId) {
            if(message.getIsDeleted()==2) {
                messageRepository.delete(message);
                return;
            }
                message.setIsDeleted(1);
                messageRepository.save(message);
                return;
        }
        // reciever인 경우 1이면 제거 0이면 2로 변경
        if(message.getIsDeleted()==1) {
            messageRepository.delete(message);
            return;
        }
        message.setIsDeleted(2);
        messageRepository.save(message);
    }

    @Transactional
    public void deleteReply(Long id, Long userId) throws Exception{
        Reply reply = replyRepository.findById(id).orElseThrow(Exception::new);
        // user가 sender 인 경우 2이면 제거, 0이면 1로 변경
        if(reply.getMemberId() == userId) {
            if(reply.getIsDeleted()==2) {
                replyRepository.delete(reply);
                return;
            }
            reply.setIsDeleted(1);
            replyRepository.save(reply);
            return;
        }
        // reciever인 경우 1이면 제거 0이면 2로 변경
        if(reply.getIsDeleted()==1) {
            replyRepository.delete(reply);
            return;
        }
        reply.setIsDeleted(2);
        replyRepository.save(reply);
    }
}
