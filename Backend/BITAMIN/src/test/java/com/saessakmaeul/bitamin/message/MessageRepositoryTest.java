package com.saessakmaeul.bitamin.message;

import com.saessakmaeul.bitamin.member.entity.Member;
import com.saessakmaeul.bitamin.member.entity.Role;
import com.saessakmaeul.bitamin.member.repository.MemberRepository;
import com.saessakmaeul.bitamin.message.entity.Message;
import com.saessakmaeul.bitamin.message.entity.Reply;
import com.saessakmaeul.bitamin.message.repository.MessageRepository;
import com.saessakmaeul.bitamin.message.repository.ReplyRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDateTime;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

@DataJpaTest
public class MessageRepositoryTest {
    @Autowired
    MessageRepository messageRepository;

    @Autowired
    ReplyRepository replyRepository;

    @Autowired
    MemberRepository memberRepository;

    Member sender;

    Member receiver;

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
    }

    @Test
    public void findByRecieverId() {
        // given
        Message testMessage1 = new Message();
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

        Message testMessage2 = new Message();
        testMessage2.setSenderId(sender.getId());
        testMessage2.setRecieverId(receiver.getId());
        testMessage2.setCategory("category");
        testMessage2.setTitle("title");
        testMessage2.setContent("content");
        testMessage2.setSendDate(LocalDateTime.of(2024,7,1,0,0));
        testMessage2.setCounselingDate(LocalDateTime.now());
        testMessage2.setIsRead(false);
        testMessage2.setIsDeleted(0);
        testMessage2 = messageRepository.save(testMessage2);

        Message testMessage3 = new Message();
        testMessage3.setSenderId(sender.getId());
        testMessage3.setRecieverId(receiver.getId());
        testMessage3.setCategory("category");
        testMessage3.setTitle("title");
        testMessage3.setContent("content");
        testMessage3.setSendDate(LocalDateTime.of(2024,7,1,0,0));
        testMessage3.setCounselingDate(LocalDateTime.now());
        testMessage3.setIsRead(false);
        testMessage3.setIsDeleted(0);
        testMessage3 = messageRepository.save(testMessage3);

        Message testMessage4 = new Message();
        testMessage4.setSenderId(receiver.getId());
        testMessage4.setRecieverId(sender.getId());
        testMessage4.setCategory("category");
        testMessage4.setTitle("title");
        testMessage4.setContent("content");
        testMessage4.setSendDate(LocalDateTime.of(2024,7,1,0,0));
        testMessage4.setCounselingDate(LocalDateTime.now());
        testMessage4.setIsRead(false);
        testMessage4.setIsDeleted(0);
        testMessage4 = messageRepository.save(testMessage4);

        // when
        List<Message> messageSenderList = messageRepository.findByRecieverId(sender.getId());

        // then
        assertEquals(1,messageSenderList.size());
        assertEquals(testMessage4.getId(),messageSenderList.get(0).getId());
    }

    @Test
    public void findBySenderId() {
        // given
        Message testMessage1 = new Message();
        testMessage1.setSenderId(receiver.getId());
        testMessage1.setRecieverId(sender.getId());
        testMessage1.setCategory("category");
        testMessage1.setTitle("title");
        testMessage1.setContent("content");
        testMessage1.setSendDate(LocalDateTime.of(2024,7,1,0,0));
        testMessage1.setCounselingDate(LocalDateTime.now());
        testMessage1.setIsRead(false);
        testMessage1.setIsDeleted(0);
        testMessage1 = messageRepository.save(testMessage1);

        Message testMessage2 = new Message();
        testMessage2.setSenderId(receiver.getId());
        testMessage2.setRecieverId(sender.getId());
        testMessage2.setCategory("category");
        testMessage2.setTitle("title");
        testMessage2.setContent("content");
        testMessage2.setSendDate(LocalDateTime.of(2024,7,1,0,0));
        testMessage2.setCounselingDate(LocalDateTime.now());
        testMessage2.setIsRead(false);
        testMessage2.setIsDeleted(0);
        testMessage2 = messageRepository.save(testMessage2);

        Message testMessage3 = new Message();
        testMessage3.setSenderId(receiver.getId());
        testMessage3.setRecieverId(sender.getId());
        testMessage3.setCategory("category");
        testMessage3.setTitle("title");
        testMessage3.setContent("content");
        testMessage3.setSendDate(LocalDateTime.of(2024,7,1,0,0));
        testMessage3.setCounselingDate(LocalDateTime.now());
        testMessage3.setIsRead(false);
        testMessage3.setIsDeleted(0);
        testMessage3 = messageRepository.save(testMessage3);

        Message testMessage4 = new Message();
        testMessage4.setSenderId(sender.getId());
        testMessage4.setRecieverId(receiver.getId());
        testMessage4.setCategory("category");
        testMessage4.setTitle("title");
        testMessage4.setContent("content");
        testMessage4.setSendDate(LocalDateTime.of(2024,7,1,0,0));
        testMessage4.setCounselingDate(LocalDateTime.now());
        testMessage4.setIsRead(false);
        testMessage4.setIsDeleted(0);
        testMessage4 = messageRepository.save(testMessage4);

        // when
        List<Message> messageSenderList = messageRepository.findBySenderId(sender.getId());

        // then
        assertEquals(1,messageSenderList.size());
        assertEquals(testMessage4.getId(),messageSenderList.get(0).getId());
    }

    @Test
    public void findByMessageId() {
        // given
        Message testMessage1 = new Message();
        testMessage1.setSenderId(receiver.getId());
        testMessage1.setRecieverId(sender.getId());
        testMessage1.setCategory("category");
        testMessage1.setTitle("title");
        testMessage1.setContent("content");
        testMessage1.setSendDate(LocalDateTime.of(2024,7,1,0,0));
        testMessage1.setCounselingDate(LocalDateTime.now());
        testMessage1.setIsRead(false);
        testMessage1.setIsDeleted(0);
        testMessage1 = messageRepository.save(testMessage1);

        Reply testReply1 = new Reply();
        testReply1.setMessageId(testMessage1.getId());
        testReply1.setMemberId(sender.getId());
        testReply1.setIsDeleted(0);
        testReply1.setSendDate(LocalDateTime.of(2024,7,4,0,0));
        testReply1 = replyRepository.save(testReply1);

        Reply testReply2 = new Reply();
        testReply2.setMessageId(testMessage1.getId());
        testReply2.setMemberId(sender.getId());
        testReply2.setIsDeleted(0);
        testReply2.setSendDate(LocalDateTime.of(2024,7,6,0,0));
        testReply2 = replyRepository.save(testReply2);

        Reply testReply3 = new Reply();
        testReply3.setMessageId(testMessage1.getId());
        testReply3.setMemberId(sender.getId());
        testReply3.setIsDeleted(0);
        testReply3.setSendDate(LocalDateTime.of(2024,7,5,0,0));
        testReply3 = replyRepository.save(testReply3);

        // when
        List<Reply> replyList = replyRepository.findByMessageId(testMessage1.getId());

        // then
        assertEquals(3,replyList.size());
    }
}
