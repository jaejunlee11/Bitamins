package com.saessakmaeul.bitamin.complaint;

import com.saessakmaeul.bitamin.complaint.entity.Complaint;
import com.saessakmaeul.bitamin.complaint.entity.UserStop;
import com.saessakmaeul.bitamin.complaint.repository.ComplaintRepository;
import com.saessakmaeul.bitamin.complaint.repository.UserStopRepository;
import com.saessakmaeul.bitamin.member.entity.Member;
import com.saessakmaeul.bitamin.member.entity.Role;
import com.saessakmaeul.bitamin.member.repository.MemberRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

@DataJpaTest
public class ComplaintRepositoryTests {
    @Autowired
    private ComplaintRepository complaintRepository;

    @Autowired
    private MemberRepository memberRepository;

    // 멤버 생성
    /*
        1. admin(관리자)
        2. complaint(신고자)
        3. respondent(피신고자)
     */
    private Member admin;
    private Member complaint;
    private Member respondent;
    // 신고 생성
    /*
        1. complaint -> respondent (2024.07.01)
        2. complaint -> respondent (2024.07.03)
        3. complaint -> respondent (2024.07.02)
        4. complaint -> respondent (2024.07.04) + isResoleved = true, 1
        5. complaint -> respondent (2024.07.04) + isResoleved = true, 2
        6. complaint -> respondent (2024.07.04) + isResoleved = true, 1
        7. complaint -> respondent (2024.07.04) + isResoleved = true, 1
        8. complaint -> respondent (2024.07.04)
     */

    private Complaint complaint1;
    private Complaint complaint2;
    private Complaint complaint3;
    private Complaint complaint4;
    private Complaint complaint5;
    private Complaint complaint6;
    private Complaint complaint7;
    private Complaint complaint8;

    // 정지 설정
    /*
        1. id : respondent, stopRepository : 2024-08-30
     */
    private UserStop userStop;
    @Autowired
    private UserStopRepository userStopRepository;

    @BeforeEach
    public void setUp() {
        admin = Member.builder()
                .email("sender@example.com")
                .password("password")
                .name("Sender Name")
                .nickname("sender")
                .dongCode("1111010200")
                .birthday(LocalDate.of(1990 - 1900, Calendar.JANUARY, 1))  // Setting a sample birthday
                .role(Role.ROLE_ADMIN)
                .build();
        admin = memberRepository.save(admin);

        respondent = Member.builder()
                .email("sender@example.com")
                .password("password")
                .name("respondent Name")
                .nickname("respondent")
                .dongCode("1111010200")
                .birthday(LocalDate.of(1990 - 1900, Calendar.JANUARY, 1))  // Setting a sample birthday
                .role(Role.ROLE_MEMBER)
                .build();
        respondent = memberRepository.save(respondent);

        complaint = Member.builder()
                .email("sender@example.com")
                .password("password")
                .name("complaint Name")
                .nickname("complaint")
                .dongCode("1111010200")
                .birthday(LocalDate.of(1990 - 1900, Calendar.JANUARY, 1))  // Setting a sample birthday
                .role(Role.ROLE_MEMBER)
                .build();
        complaint = memberRepository.save(complaint);
    }
    @Test
    public void findAllByRespondentId() throws Exception {
        // given
        complaint1 = new Complaint();
        complaint1.setCategory(1);
        complaint1.setContent("신고");
        complaint1.setJudgement(0);
        complaint1.setComplainantId(complaint.getId());
        complaint1.setRespondentId(respondent.getId());
        complaint1.setSendDate(LocalDateTime.of(2024, 7, 1, 0, 0));
        complaint1.setIsResolved(false);
        complaint1.setType(0);
        complaint1 = complaintRepository.save(complaint1);

        complaint2 = new Complaint();
        complaint2.setCategory(1);
        complaint2.setContent("신고");
        complaint2.setJudgement(0);
        complaint2.setComplainantId(complaint.getId());
        complaint2.setRespondentId(respondent.getId());
        complaint2.setSendDate(LocalDateTime.of(2024, 7, 3, 0, 0));
        complaint2.setIsResolved(false);
        complaint2.setType(0);
        complaint2 = complaintRepository.save(complaint2);

        complaint3 = new Complaint();
        complaint3.setCategory(1);
        complaint3.setContent("신고");
        complaint3.setJudgement(0);
        complaint3.setComplainantId(complaint.getId());
        complaint3.setRespondentId(respondent.getId());
        complaint3.setSendDate(LocalDateTime.of(2024, 7, 2, 0, 0));
        complaint3.setIsResolved(false);
        complaint3.setType(0);
        complaint3 = complaintRepository.save(complaint3);

        complaint4 = new Complaint();
        complaint4.setCategory(1);
        complaint4.setContent("신고");
        complaint4.setJudgement(1);
        complaint4.setComplainantId(complaint.getId());
        complaint4.setRespondentId(respondent.getId());
        complaint4.setSendDate(LocalDateTime.of(2024, 7, 4, 0, 0));
        complaint4.setIsResolved(true);
        complaint4.setType(0);
        complaint4 = complaintRepository.save(complaint4);

        complaint5 = new Complaint();
        complaint5.setCategory(1);
        complaint5.setContent("신고");
        complaint5.setJudgement(2);
        complaint5.setComplainantId(complaint.getId());
        complaint5.setRespondentId(respondent.getId());
        complaint5.setSendDate(LocalDateTime.of(2024, 7, 4, 0, 0));
        complaint5.setIsResolved(true);
        complaint5.setType(0);
        complaint5 = complaintRepository.save(complaint5);

        complaint6 = new Complaint();
        complaint6.setCategory(3);
        complaint6.setContent("신고");
        complaint6.setJudgement(1);
        complaint6.setComplainantId(complaint.getId());
        complaint6.setRespondentId(respondent.getId());
        complaint6.setSendDate(LocalDateTime.of(2024, 7, 4, 0, 0));
        complaint6.setIsResolved(true);
        complaint6.setType(0);
        complaint6 = complaintRepository.save(complaint6);

        complaint7 = new Complaint();
        complaint7.setCategory(2);
        complaint7.setContent("신고");
        complaint7.setJudgement(1);
        complaint7.setComplainantId(complaint.getId());
        complaint7.setRespondentId(respondent.getId());
        complaint7.setSendDate(LocalDateTime.of(2024, 7, 4, 0, 0));
        complaint7.setIsResolved(true);
        complaint7.setType(0);
        complaint7 = complaintRepository.save(complaint7);

        complaint8 = new Complaint();
        complaint8.setCategory(2);
        complaint8.setContent("신고");
        complaint8.setJudgement(0);
        complaint8.setComplainantId(respondent.getId());
        complaint8.setRespondentId(complaint.getId());
        complaint8.setSendDate(LocalDateTime.of(2024, 6, 20, 0, 0));
        complaint8.setIsResolved(false);
        complaint8.setType(0);
        complaint8 = complaintRepository.save(complaint8);

        // when
        List<Complaint> complaintList = complaintRepository.findAllByRespondentId(respondent.getId());

        //then
        assertEquals(7, complaintList.size());
    }
}
