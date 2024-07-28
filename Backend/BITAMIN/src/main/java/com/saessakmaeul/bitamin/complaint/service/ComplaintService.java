package com.saessakmaeul.bitamin.complaint.service;

import com.saessakmaeul.bitamin.complaint.dto.responseDto.ComplaintSimpleResponse;
import com.saessakmaeul.bitamin.complaint.dto.responseDto.ComplatinDetailResponse;
import com.saessakmaeul.bitamin.complaint.entity.Complaint;
import com.saessakmaeul.bitamin.complaint.entity.UserStop;
import com.saessakmaeul.bitamin.complaint.repository.ComplaintRepository;
import com.saessakmaeul.bitamin.complaint.repository.UserStopRepository;
import com.saessakmaeul.bitamin.member.entity.Member;
import com.saessakmaeul.bitamin.member.entity.Role;
import com.saessakmaeul.bitamin.member.repository.MemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.rmi.server.ExportException;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

@Service
public class ComplaintService {
    @Autowired
    private ComplaintRepository complaintRepository;

    @Autowired
    private UserStopRepository userStopRepository;

    @Autowired
    private MemberRepository memberRepository;

    public List<ComplaintSimpleResponse> getComplaintList(long userId) throws Exception{
        Member member =  memberRepository.findById(userId).orElseThrow(Exception::new);
        if(!member.getRole().equals(Role.ROLE_ADMIN)) throw new Exception("admin이 아닙니다.");
        List<Complaint> complaintList = complaintRepository.findAll();
        List<ComplaintSimpleResponse> result = new ArrayList<>();
        for(Complaint complaint : complaintList){
            if(complaint.getIsResolved()) continue;
            ComplaintSimpleResponse response = ComplaintSimpleResponse.builder()
                    .id(complaint.getId())
                    .respondentNickname(getNickName(complaint.getRespondentId()))
                    .complainantNickname(getNickName(complaint.getComplainantId()))
                    .sendDate(complaint.getSendDate())
                    .build();
            result.add(response);
        }
        return result;
    }

    public ComplatinDetailResponse getComplaintDetail(long id, long userId) throws Exception{
        Member member =  memberRepository.findById(userId).orElseThrow(() -> new Exception("해당 id를 가진 멤버가 존재하지 않습니다."));
        if(!member.getRole().equals(Role.ROLE_ADMIN)) throw new Exception("admin이 아닙니다.");
        Complaint response = complaintRepository.findById(id).orElseThrow(()->new Exception("해당 id를 가진 신고가 없습니다."));
        // 정지 남은 일수
        int remainStopDate = 0;
        // 피신고자 현재 정지 기간 계산
        try{
            // 피신고자가 정지를 당해있는 경우
            UserStop userStop = userStopRepository.findById(response.getRespondentId()).orElseThrow(Exception::new);
            LocalDateTime stopDate = userStop.getStopDate();
            remainStopDate = (int) ChronoUnit.DAYS.between(LocalDateTime.now(),stopDate);
        } catch (ExportException e){
            // 피신고자가 정지를 안 당해있는 경우
            remainStopDate = 0;
        }
        // 역대 피신고자 정지 기간 및 횟수
        int judgementCount = 0;
        int judgementDate = 0;
        List<Complaint> complaintList = complaintRepository.findAllByRespondentId(response.getRespondentId());
        for(Complaint complaint : complaintList){
            judgementCount++;
            judgementDate += complaint.getJudgement();
        }

        ComplatinDetailResponse result = ComplatinDetailResponse.builder()
                .id(id)
                .respondentNickname(getNickName(response.getRespondentId()))
                .complainantNickname(getNickName(response.getComplainantId()))
                .content(response.getContent())
                .category(response.getCategory())
                .sendDate(response.getSendDate())
                .stopDate(remainStopDate)
                .judgementCount(judgementCount)
                .judgementDate(judgementDate)
                .build();
        return result;
    }

    private String getNickName(long userId) throws Exception {
        return memberRepository.findById(userId).orElseThrow(Exception::new).getNickname();
    }
}
