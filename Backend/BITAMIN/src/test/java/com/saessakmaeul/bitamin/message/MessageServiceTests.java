package com.saessakmaeul.bitamin.message;

import com.saessakmaeul.bitamin.member.entity.Member;
import com.saessakmaeul.bitamin.member.entity.Role;
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
import com.saessakmaeul.bitamin.message.service.MessageService;
import com.saessakmaeul.bitamin.util.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
public class MessageServiceTests {
    // 테스트를 위한 가짜 객체 생성
    @Autowired
    private MessageService messageService;

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private ReplyRepository replyRepository;

    @Autowired
    private MemberRepository memberRepository;

    private Member sender;

    private Member receiver;

    private Member dummy;

    private Message testMessage1;

    private Message testMessage2;

    private Message testMessage3;

    Reply testReply1;

    Reply testReply2;

    Reply testReply3;
    // 테스트를 위한 유저 생성
        /*
        1. send user(nickName : sender)
        2. reciver user(nickName : reciver)
        3. dummy user(nickName : dummy)
         */
    // 테스트를 위한 message 생성
        /*
        1. send -> reciever, 2024.07.01
        2. send -> reciever, 2024.07.03
        3. send -> reciever, 2024.07.02
         */
    // 테스트를 위한 reply 생성
        /*
        1. send -> reciever, 2024.07.04
        2. send -> reciever, 2024.07.06
        3. send -> reciever, 2024.07.05
         */
    @BeforeEach
    public void setup() {
        sender = Member.builder()
                .email("sender@example.com")
                .password("password")
                .name("Sender Name")
                .nickname("sender")
                .dongCode("1111010200")
                .birthday(new Date(1990 - 1900, Calendar.JANUARY, 1))  // Setting a sample birthday
                .role(Role.ROLE_MEMBER)
                .build();
        sender = memberRepository.save(sender);

        receiver = Member.builder()
                .email("receiver@example.com")
                .password("password")
                .name("Receiver Name")
                .nickname("receiver")
                .dongCode("1111010200")
                .birthday(new Date(1992 - 1900, Calendar.FEBRUARY, 2))  // Setting a sample birthday
                .role(Role.ROLE_MEMBER)
                .build();
        receiver = memberRepository.save(receiver);

        dummy = Member.builder()
                .email("dummy@example.com")
                .password("password")
                .name("Receiver Name")
                .nickname("dummy")
                .dongCode("1111010200")
                .birthday(new Date(1992 - 1900, Calendar.FEBRUARY, 2))  // Setting a sample birthday
                .role(Role.ROLE_MEMBER)
                .build();
        dummy = memberRepository.save(dummy);

        testMessage1 = new Message();
        testMessage1.setSenderId(sender.getId());
        testMessage1.setRecieverId(receiver.getId());
        testMessage1.setCategory("category");
        testMessage1.setTitle("title");
        testMessage1.setContent("content");
        testMessage1.setSendDate(LocalDateTime.of(2024,7,1,0,0));
        testMessage1.setCounselingDate(LocalDateTime.now());
        testMessage1.setIsRead(false);
        testMessage1.setIsDeleted(0);
        testMessage1 = messageRepository.save(testMessage1);

        testMessage2 = new Message();
        testMessage2.setSenderId(sender.getId());
        testMessage2.setRecieverId(receiver.getId());
        testMessage2.setCategory("category");
        testMessage2.setTitle("title");
        testMessage2.setContent("content");
        testMessage2.setSendDate(LocalDateTime.of(2024,7,3,0,0));
        testMessage2.setCounselingDate(LocalDateTime.now());
        testMessage2.setIsRead(false);
        testMessage2.setIsDeleted(0);
        testMessage2 = messageRepository.save(testMessage2);

        testMessage3 = new Message();
        testMessage3.setSenderId(sender.getId());
        testMessage3.setRecieverId(receiver.getId());
        testMessage3.setCategory("category");
        testMessage3.setTitle("title");
        testMessage3.setContent("content");
        testMessage3.setSendDate(LocalDateTime.of(2024,7,2,0,0));
        testMessage3.setCounselingDate(LocalDateTime.now());
        testMessage3.setIsRead(false);
        testMessage3.setIsDeleted(0);
        testMessage3 = messageRepository.save(testMessage3);

        testReply1 = new Reply();
        testReply1.setMessageId(testMessage1.getId());
        testReply1.setMemberId(sender.getId());
        testReply1.setIsDeleted(0);
        testReply1.setSendDate(LocalDateTime.of(2024,7,4,0,0));
        testReply1 = replyRepository.save(testReply1);

        testReply2 = new Reply();
        testReply2.setMessageId(testMessage1.getId());
        testReply2.setMemberId(sender.getId());
        testReply2.setIsDeleted(0);
        testReply2.setSendDate(LocalDateTime.of(2024,7,6,0,0));
        testReply2 = replyRepository.save(testReply2);

        testReply3 = new Reply();
        testReply3.setMessageId(testMessage1.getId());
        testReply3.setMemberId(sender.getId());
        testReply3.setIsDeleted(0);
        testReply3.setSendDate(LocalDateTime.of(2024,7,5,0,0));
        testReply3 = replyRepository.save(testReply3);
    }

    // message 리스트 확인 테스트
    /*
        확인해야할 것
        1. 송신자가 본인, 수신자가 본인인 경우를 합쳐서 메시지가 잘 넘어 오는지
        2. 메시지의 정렬이 최신순이 먼저로 잘 넘어 오는지
        3. 받거나 보낸 메시지가 없다면 메시지 갯수가 0으로 잘 나오는지
        4. 메시지가 송신자가 삭제한 것(1)인 경우 안나오는 것 확인
        5. 메시지가 수신자가 삭제한 것(2)인 경우 안나오는 것 확인
     */
    @Test
    public void testGetAllMessages() throws Exception {
        List<MessageSimpleResponse> messages = messageService.getAllMessages(sender.getId());
        assertEquals(3, messages.size(),"추가 송신전 수신자 기준 message 갯수 확인");

        List<MessageSimpleResponse> recivermessages = messageService.getAllMessages(receiver.getId());
        assertEquals(3, recivermessages.size(),"추가 송신전 송신자 기준message 갯수 확인");

        List<MessageSimpleResponse> dummymessages = messageService.getAllMessages(dummy.getId());
        assertEquals(0,dummymessages.size(),"받거나 보낸 메시지가 없는 경우 갯수 확인");

        assertEquals(messages.get(0).getId(),testMessage2.getId(),"첫번째 메시지 2");
        assertEquals(messages.get(1).getId(),testMessage3.getId(),"두번째 메시지 3");
        assertEquals(messages.get(2).getId(),testMessage1.getId(),"세번째 메시지 1");

        // 추가 송신
        Message testMessage = new Message();;
        testMessage.setSenderId(sender.getId());
        testMessage.setRecieverId(dummy.getId());
        testMessage.setCategory("category");
        testMessage.setTitle("title");
        testMessage.setContent("content");
        testMessage.setSendDate(LocalDateTime.of(2024,7,5,0,0));
        testMessage.setCounselingDate(LocalDateTime.now());
        testMessage.setIsRead(false);
        testMessage.setIsDeleted(0);
        testMessage = messageRepository.save(testMessage);

        messages = messageService.getAllMessages(sender.getId());
        assertEquals(4, messages.size(),"추가 송신후 송신자 기준 message 갯수 확인");
        recivermessages = messageService.getAllMessages(receiver.getId());
        assertEquals(3, recivermessages.size(),"추가 송신후 수신자 기준message 갯수 확인");

        testMessage1.setIsDeleted(1);
        testMessage1 = messageRepository.save(testMessage1);
        testMessage3.setIsDeleted(2);
        testMessage3 = messageRepository.save(testMessage3);

        messages = messageService.getAllMessages(sender.getId());
        boolean deleteFlag1 = false;
        boolean deleteFlag2 = false;
        for(MessageSimpleResponse message : messages){
            if(message.getId() == testMessage1.getId()) deleteFlag1 = true;
            if(message.getId() == testMessage3.getId()) deleteFlag2 = true;
        }
        assertFalse(deleteFlag1, "삭제 후 송신자 기준 message 존재 확인");
        assertTrue(deleteFlag2,"삭제 후 송신자 기준 message 존재 확인");

        recivermessages = messageService.getAllMessages(receiver.getId());
        deleteFlag1 = false;
        deleteFlag2 = false;
        for(MessageSimpleResponse message : recivermessages){
            if(message.getId() == testMessage3.getId()) deleteFlag1 = true;
            if(message.getId() == testMessage1.getId()) deleteFlag2 = true;
        }
        assertFalse(deleteFlag1,"삭제 후 수신자 기준 message 존재 확인");
        assertTrue(deleteFlag2,"삭제 후 수신자 기준 message 존재 확인");
    }

    // message detail 확인 테스트
    /*
        확인해야할 것
        1. 해당 id의 메시지가 없는 경우 exception 발생
        2. 송신자와 수신자의 닉네임이 제대로 들어있는지 확인
        3. 메시지의 답장 리스트 확인
            3.1. 답장 리스트가 비어있으면 0개 출력
            3.2. 송신자 / 수신자에 따라서 닉네임이 제대로 들어 있는지
            3.3. 리스트가 시간순으로 정렬이 잘 되어 있느지
            3.4. 답장이 송신자가 삭제한 것(1)인 경우 안나오는 것 확인
            3.5. 답장이 수신자가 삭제한 것(2)인 경우 안나오는 것 확인
     */
    @Test
    public void testMessageDetail() throws Exception {
        Exception exception = assertThrows(Exception.class,()->messageService.getMessageDetail(Long.MAX_VALUE,sender.getId()));
        assertEquals("해당 id를 가진 메시지가 없습니다.",exception.getMessage());

        MessageDetailResponse response1 = messageService.getMessageDetail(testMessage1.getId(), sender.getId());
        assertEquals(receiver.getNickname(),response1.getNickname());

        MessageDetailResponse response2 = messageService.getMessageDetail(testMessage1.getId(), receiver.getId());
        assertEquals(sender.getNickname(),response2.getNickname());

        MessageDetailResponse response3 = messageService.getMessageDetail(testMessage2.getId(), sender.getId());
        assertEquals(0,response3.getReplies().size());

        // sender가 호출했을때 답장 닉네임
        assertEquals(sender.getNickname(),response1.getReplies().get(0).getMemberNickName());
        // reciever가 호출했을때 답장 닉네임
        assertEquals(sender.getNickname(),response2.getReplies().get(0).getMemberNickName());

        assertEquals(testReply1.getId(),response1.getReplies().get(0).getId());
        assertEquals(testReply3.getId(),response1.getReplies().get(1).getId());
        assertEquals(testReply2.getId(),response1.getReplies().get(2).getId());

        testReply1.setIsDeleted(1);
        final Reply testDelete1 = replyRepository.save(testReply1);

        testReply2.setIsDeleted(2);
        final Reply testDelete2 = replyRepository.save(testReply2);

        response1 = messageService.getMessageDetail(testMessage1.getId(), sender.getId());

        boolean deleteFlag1 = true;
        boolean deleteFlag2 = true;
        for(Replies reply : response1.getReplies()) {
            if(reply.getId() == testDelete1.getId()) deleteFlag1 = false;
            if(reply.getId() == testDelete2.getId()) deleteFlag2 = false;
        }
        assertTrue(deleteFlag1,"송신자 기준 : 송신자가 삭제");
        assertFalse(deleteFlag2,"송신자 기준 : 수신자가 삭제");

        response2 = messageService.getMessageDetail(testMessage1.getId(), receiver.getId());
        deleteFlag1 = true;
        deleteFlag2 = true;
        for(Replies reply : response2.getReplies()) {
            if(reply.getId() == testDelete1.getId()) deleteFlag1 = false;
            if(reply.getId() == testDelete2.getId()) deleteFlag2 = false;
        }
        assertFalse(deleteFlag1,"수신자 기준 : 송신자가 삭제");
        assertTrue(deleteFlag2,"수신자 기준 : 수신자가 삭제");
    }
    // message 송신 확인 테스트
    /*
        확인해야할 것
        1. 수신자가 없는 id인 경우 exception 발생
        2. 송신자와 수신자 id가 제대로 들어갔는지 확인
     */
    @Test
    public void testPostMessage() throws Exception {
        final MessageRegistRequest messageRegistRequest = MessageRegistRequest.builder()
                .recieverId(Long.MAX_VALUE)
                .title("제목")
                .category("독서")
                .content("내용")
                .counselingDate(LocalDateTime.now())
                .build();
        Exception exception = assertThrows(Exception.class,()-> messageService.registMessage(messageRegistRequest,sender.getId()));
        String message = exception.getMessage();
        assertEquals("reciever가 존재하지 않습니다.", message);

        MessageRegistRequest testRequest = MessageRegistRequest.builder()
                .recieverId(receiver.getId())
                .title("제목")
                .category("독서")
                .content("내용")
                .counselingDate(LocalDateTime.now())
                .build();
        Message testMessage = messageService.registMessage(testRequest,sender.getId());
        assertEquals(receiver.getId(),testMessage.getRecieverId());
        assertEquals(sender.getId(),testMessage.getSenderId());
    }

    // reply 송신 테스트
    /*
        확인해야할 것
        1. 해당 id의 메시지가 있는지 확인
        2. memberId가 제대로 들어가는지 확인
     */
    @Test
    public void postReply() throws Exception {
        final ReplyRegistRequest replyRegistRequest = ReplyRegistRequest.builder()
                .content("내용")
                .build();
        Exception exception = assertThrows(Exception.class, ()->messageService.registReply(replyRegistRequest, Long.MAX_VALUE, sender.getId()));
        assertEquals("해당 id의 메시지가 없습니다.",exception.getMessage());

        Reply reply = messageService.registReply(replyRegistRequest, testMessage1.getId(), sender.getId());
        assertEquals(sender.getId(),reply.getMemberId());
    }

    // message 삭제 리스트
    /*
        확인해야할 것
        1. 해당 메시지가 없는 경우
        2. 0일때 sender가 제거시 1로 변경 확인
        3. 0일때 reciever가 제거시 2로 변경
        4. 1일때 reciever가 제거시 제거
        5. 2일때 sender가 제거시 제거
     */
    @Test
    public void deleteMessage() throws Exception {
        Exception exception = assertThrows(Exception.class,()->messageService.deleteMessage(Long.MAX_VALUE, sender.getId()));
        assertEquals("해당 id의 메시지가 없습니다.",exception.getMessage());

        Message response1 = messageService.deleteMessage(testMessage1.getId(), sender.getId());
        assertEquals(1,response1.getIsDeleted());

        Message response2 = messageService.deleteMessage(testMessage2.getId(), receiver.getId());
        assertEquals(2,response2.getIsDeleted());

        messageService.deleteMessage(testMessage2.getId(), sender.getId());
        assertFalse(messageRepository.findById(testMessage2.getId()).isPresent());

        messageService.deleteMessage(testMessage1.getId(), receiver.getId());
        assertFalse(messageRepository.findById(testMessage1.getId()).isPresent());
    }

    // reply 삭제 테스트
    /*
        확인해야할 것
        1. 해당 답장이 없는 경우
        2. 0일때 sender가 제거시 1로 변경 확인
        3. 0일때 reciever가 제거시 2로 변경
        4. 1일때 reciever가 제거시 제거
        5. 2일때 sender가 제거시 제거
     */
    @Test
    public void deleteReply() throws Exception {
        Exception exception = assertThrows(Exception.class,()->messageService.deleteReply(Long.MAX_VALUE, sender.getId()));
        assertEquals("해당 id의 답장이 없습니다.",exception.getMessage());

        Reply response1 = messageService.deleteReply(testReply1.getId(), sender.getId());
        assertEquals(1,response1.getIsDeleted());

        Reply response2 = messageService.deleteReply(testReply2.getId(), receiver.getId());
        assertEquals(2,response2.getIsDeleted());

        messageService.deleteReply(testReply2.getId(), sender.getId());
        assertFalse(replyRepository.findById(testMessage2.getId()).isPresent());

        messageService.deleteReply(testReply1.getId(), receiver.getId());
        assertFalse(replyRepository.findById(testMessage1.getId()).isPresent());
    }
}

