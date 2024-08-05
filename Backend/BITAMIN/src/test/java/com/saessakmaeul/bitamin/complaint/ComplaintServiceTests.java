package com.saessakmaeul.bitamin.complaint;

import com.saessakmaeul.bitamin.complaint.dto.requestDto.ComplaintRegistRequest;
import com.saessakmaeul.bitamin.complaint.dto.responseDto.ComplaintSimpleResponse;
import com.saessakmaeul.bitamin.complaint.dto.responseDto.ComplatinDetailResponse;
import com.saessakmaeul.bitamin.complaint.entity.Complaint;
import com.saessakmaeul.bitamin.complaint.entity.UserStop;
import com.saessakmaeul.bitamin.complaint.repository.ComplaintRepository;
import com.saessakmaeul.bitamin.complaint.repository.UserStopRepository;
import com.saessakmaeul.bitamin.complaint.service.ComplaintService;
import com.saessakmaeul.bitamin.member.entity.Member;
import com.saessakmaeul.bitamin.member.entity.Role;
import com.saessakmaeul.bitamin.member.repository.MemberRepository;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
public class ComplaintServiceTests {
    @Autowired
    private ComplaintService complaintService;

    @Autowired
    private ComplaintRepository complaintRepository;

    @Autowired
    private UserStopRepository stopRepository;

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

        complaint1 = new Complaint();
        complaint1.setCategory(1);
        complaint1.setContent("신고");
        complaint1.setJudgement(0);
        complaint1.setComplainantId(complaint.getId());
        complaint1.setRespondentId(respondent.getId());
        complaint1.setSendDate(LocalDateTime.of(2024,7,1,0,0));
        complaint1.setIsResolved(false);
        complaint1.setType(0);
        complaint1 = complaintRepository.save(complaint1);

        complaint2 = new Complaint();
        complaint2.setCategory(1);
        complaint2.setContent("신고");
        complaint2.setJudgement(0);
        complaint2.setComplainantId(complaint.getId());
        complaint2.setRespondentId(respondent.getId());
        complaint2.setSendDate(LocalDateTime.of(2024,7,3,0,0));
        complaint2.setIsResolved(false);
        complaint2.setType(0);
        complaint2 = complaintRepository.save(complaint2);

        complaint3 = new Complaint();
        complaint3.setCategory(1);
        complaint3.setContent("신고");
        complaint3.setJudgement(0);
        complaint3.setComplainantId(complaint.getId());
        complaint3.setRespondentId(respondent.getId());
        complaint3.setSendDate(LocalDateTime.of(2024,7,2,0,0));
        complaint3.setIsResolved(false);
        complaint3.setType(0);
        complaint3 = complaintRepository.save(complaint3);

        complaint4 = new Complaint();
        complaint4.setCategory(1);
        complaint4.setContent("신고");
        complaint4.setJudgement(1);
        complaint4.setComplainantId(complaint.getId());
        complaint4.setRespondentId(respondent.getId());
        complaint4.setSendDate(LocalDateTime.of(2024,7,4,0,0));
        complaint4.setIsResolved(true);
        complaint4.setType(0);
        complaint4 = complaintRepository.save(complaint4);

        complaint5 = new Complaint();
        complaint5.setCategory(1);
        complaint5.setContent("신고");
        complaint5.setJudgement(2);
        complaint5.setComplainantId(complaint.getId());
        complaint5.setRespondentId(respondent.getId());
        complaint5.setSendDate(LocalDateTime.of(2024,7,4,0,0));
        complaint5.setIsResolved(true);
        complaint5.setType(0);
        complaint5 = complaintRepository.save(complaint5);

        complaint6 = new Complaint();
        complaint6.setCategory(3);
        complaint6.setContent("신고");
        complaint6.setJudgement(1);
        complaint6.setComplainantId(complaint.getId());
        complaint6.setRespondentId(respondent.getId());
        complaint6.setSendDate(LocalDateTime.of(2024,7,4,0,0));
        complaint6.setIsResolved(true);
        complaint6.setType(0);
        complaint6 = complaintRepository.save(complaint6);

        complaint7 = new Complaint();
        complaint7.setCategory(2);
        complaint7.setContent("신고");
        complaint7.setJudgement(1);
        complaint7.setComplainantId(complaint.getId());
        complaint7.setRespondentId(respondent.getId());
        complaint7.setSendDate(LocalDateTime.of(2024,7,4,0,0));
        complaint7.setIsResolved(true);
        complaint7.setType(0);
        complaint7 = complaintRepository.save(complaint7);

        complaint8 = new Complaint();
        complaint8.setCategory(2);
        complaint8.setContent("신고");
        complaint8.setJudgement(0);
        complaint8.setComplainantId(respondent.getId());
        complaint8.setRespondentId(complaint.getId());
        complaint8.setSendDate(LocalDateTime.of(2024,6,20,0,0));
        complaint8.setIsResolved(false);
        complaint8.setType(0);
        complaint8 = complaintRepository.save(complaint8);

        userStop = new UserStop();
        userStop.setId(respondent.getId());
        userStop.setStopDate(LocalDateTime.of(2024,8,30,0,0));
        userStop = userStopRepository.save(userStop);
    }

    // 신고 리스트 조회
    /*
        1. admin이 아니면 오류
        2. 리스트가 날짜 순으로 나오는지 확인
        3. resolved가 true인 것 조회 안되는지 확인
     */
    @Test
    public void getComplaintList() throws Exception {
        Exception exception = assertThrows(Exception.class,()->complaintService.getComplaintList(Long.MAX_VALUE));
        assertEquals("해당 id를 가진 멤버가 존재하지 않습니다.",exception.getMessage());

        exception = assertThrows(Exception.class,()->complaintService.getComplaintList(respondent.getId()));
        assertEquals("admin이 아닙니다.",exception.getMessage());

        List<ComplaintSimpleResponse> responseList = complaintService.getComplaintList(admin.getId());
        assertEquals(4, responseList.size());
        assertEquals(complaint2.getId(), responseList.get(0).getId());
        assertEquals(complaint3.getId(), responseList.get(1).getId());
        assertEquals(complaint1.getId(), responseList.get(2).getId());
    }
    
    // 신고 디테일 조회
    /*
        1. admin이 아니면 오류
        2. 신고 id가 없으면 오류
        3. 역대 신고 일수 확인
        4. 역대 신고 횟수 확인
        5. 역대 신고가 없는 경우 확인
        6. 남은 정지일 수 확인
        7. 닉네임 확인
     */
    @Test
     public void getComplaintDetail() throws Exception {
         Exception exception = assertThrows(Exception.class,()->complaintService.getComplaintDetail(complaint1.getId(),Long.MAX_VALUE));
         assertEquals("해당 id를 가진 멤버가 존재하지 않습니다.",exception.getMessage());

         exception = assertThrows(Exception.class,()->complaintService.getComplaintDetail(complaint1.getId(), respondent.getId()));
         assertEquals("admin이 아닙니다.",exception.getMessage());

         exception = assertThrows(Exception.class,()->complaintService.getComplaintDetail(Long.MAX_VALUE,admin.getId()));
         assertEquals("해당 id를 가진 신고가 없습니다.",exception.getMessage());

         ComplatinDetailResponse complatinDetailResponse = complaintService.getComplaintDetail(complaint1.getId(),admin.getId());
         assertEquals(5,complatinDetailResponse.getJudgementDate());
         assertEquals(4,complatinDetailResponse.getJudgementCount());
         assertEquals((int) ChronoUnit.DAYS.between(LocalDateTime.now(),LocalDateTime.of(2024,8,30,0,0)),complatinDetailResponse.getStopDate());
        assertEquals(complaint.getNickname(),complatinDetailResponse.getComplainantNickname());
        assertEquals(respondent.getNickname(),complatinDetailResponse.getRespondentNickname());

         complatinDetailResponse = complaintService.getComplaintDetail(complaint8.getId(),admin.getId());
        assertEquals(0,complatinDetailResponse.getJudgementDate());
        assertEquals(0,complatinDetailResponse.getJudgementCount());
     }

     // complain 등록 기능
    /*
        확인해야할 것
        1. complaint id 확인
        2. respondent id 확인
     */
    @Test
    public void postComplaint() throws Exception {
        ComplaintRegistRequest request = ComplaintRegistRequest.builder()
                .respondentId(respondent.getId())
                .type(0)
                .category(1)
                .content("내용")
                .build();
        Complaint response = complaintService.postComplaint(request,complaint.getId());
        assertEquals(complaint.getId(), response.getComplainantId());
        assertEquals(respondent.getId(), response.getRespondentId());
    }

    // complain 처리
    /*
        확인해야할 것
        1. id가 admin인지
        2. 해당 complaint가 처리가 안됐는지
        3. 처리가 된 것으로 변경되었는지
        4. userStop일자가 변경되었는지
        5. complaint에 추가된 숫자가 올라갔는지
        6. 없었던 userStop이 생상되었는지
     */
    @Test
    public void patchComplaint() throws Exception{
        Exception exception = assertThrows(Exception.class,()->complaintService.patchComplaint(complaint1.getId(),1,Long.MAX_VALUE));
        assertEquals("해당 id를 가진 멤버가 존재하지 않습니다.",exception.getMessage());

        exception = assertThrows(Exception.class,()->complaintService.patchComplaint(complaint1.getId(),1, respondent.getId()));
        assertEquals("admin이 아닙니다.",exception.getMessage());

        exception = assertThrows(Exception.class,()->complaintService.patchComplaint(complaint7.getId(),1,admin.getId()));
        assertEquals("이미 처리된 신고 입니다.",exception.getMessage());

        UserStop userstopTest1 = userStopRepository.findById(respondent.getId()).orElseThrow(Exception::new);
        LocalDateTime test1 = userstopTest1.getStopDate();
        complaintService.patchComplaint(complaint1.getId(),1,admin.getId());
        Complaint respose = complaintRepository.findById(complaint1.getId()).orElseThrow(Exception::new);

        UserStop userstopTest2 = userStopRepository.findById(respondent.getId()).orElseThrow(Exception::new);
        LocalDateTime test2 = userstopTest2.getStopDate();

        assertTrue(respose.getIsResolved());
        assertEquals(1,respose.getJudgement());
        assertEquals(1,(int) ChronoUnit.DAYS.between(test1,test2));

        complaintService.patchComplaint(complaint8.getId(),1,admin.getId());
        assertTrue(userStopRepository.findById(complaint.getId()).isPresent());
    }
}
