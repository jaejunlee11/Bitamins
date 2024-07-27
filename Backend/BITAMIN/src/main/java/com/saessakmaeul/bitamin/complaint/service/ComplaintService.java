package com.saessakmaeul.bitamin.complaint.service;

import com.saessakmaeul.bitamin.complaint.dto.responseDto.ComplaintSimpleResponse;
import com.saessakmaeul.bitamin.complaint.entity.Complaint;
import com.saessakmaeul.bitamin.complaint.repository.ComplaintRepository;
import com.saessakmaeul.bitamin.complaint.repository.UserStopRepository;
import com.saessakmaeul.bitamin.member.entity.Member;
import com.saessakmaeul.bitamin.member.entity.Role;
import com.saessakmaeul.bitamin.member.repository.MemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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

    private String getNickName(long userId) throws Exception {
        return memberRepository.findById(userId).orElseThrow(Exception::new).getNickname();
    }
}
