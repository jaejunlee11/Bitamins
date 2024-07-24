package com.saessakmaeul.bitamin.consultations.service;

import com.saessakmaeul.bitamin.consultations.Entity.Consultation;
import com.saessakmaeul.bitamin.consultations.Entity.Participant;
import com.saessakmaeul.bitamin.consultations.Entity.SearchCondition;
import com.saessakmaeul.bitamin.consultations.dto.request.JoinRandomRequest;
import com.saessakmaeul.bitamin.consultations.dto.request.JoinRoomRequest;
import com.saessakmaeul.bitamin.consultations.dto.request.RegistRoomRequest;
import com.saessakmaeul.bitamin.consultations.dto.response.*;
import com.saessakmaeul.bitamin.consultations.repository.ConsultationRepository;
import com.saessakmaeul.bitamin.consultations.repository.ParticipantRepository;
import com.saessakmaeul.bitamin.member.entity.Member;
import com.saessakmaeul.bitamin.member.repository.MemberRepository;
import com.saessakmaeul.bitamin.member.service.MemberServiceImpl;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ConsultationService {
    private final ConsultationRepository consultationRepository;
    private final ParticipantRepository participantRepository;
    private final MemberRepository memberRepository;

    // 방 리스트 조회
    public List<SelectAllResponse> selectAll(int page, int size, SearchCondition type) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));
        Page<Consultation> consultationPage;

        System.out.println("Service");

        if(type == null || type == SearchCondition.전체 ) consultationPage = consultationRepository.findAll(pageable);

        else if(type == SearchCondition.비밀방) consultationPage = consultationRepository.findByIsPrivated(1, pageable);

        else consultationPage = consultationRepository.findByCategory(type.name(), pageable);

        List<SelectAllResponse> consultations = consultationPage.getContent().stream()
                .map(domain -> new SelectAllResponse(
                        domain.getId(),
                        domain.getCategory(),
                        domain.getTitle(),
                        domain.getIsPrivated(),
                        domain.getPassword(),
                        domain.getStartTime(),
                        domain.getEndTime(),
                        domain.getCurrentParticipants(),
                        page,
                        size,
                        consultationPage.getTotalElements(),
                        consultationPage.getTotalPages()
                ))
                .collect(Collectors.toList());

        return consultations;
    }

    @Transactional
    public RegistRoomResponse registRoom(RegistRoomRequest registRoomRequest) {
        // 방 등록
        Consultation consultation = Consultation.builder()
                .category(registRoomRequest.getCategory())
                .title(registRoomRequest.getTitle())
                .isPrivated(registRoomRequest.isPrivated())
                .password(registRoomRequest.getPassword())
                .startTime(registRoomRequest.getStartTime())
                .endTime(registRoomRequest.getEndTime())
                .build();

        Consultation newConsultation = consultationRepository.save(consultation);

        if(newConsultation.getId() == 0) return null;

        // 참가자 등록
        LocalDate date = newConsultation.getStartTime().toLocalDate();

        Participant newParticipant = Participant.builder()
                .memberId(registRoomRequest.getMemberId())
                .memberNickname(registRoomRequest.getMemberNickname())
                .consultationId(newConsultation.getId())
                .consultationDate(date)
                .build();

        Long pId = participantRepository.save(newParticipant).getId();

        if(pId == 0) return null;

        // 방 현재 참가자 수 수정
        newConsultation.setCurrentParticipants(newConsultation.getCurrentParticipants() + 1);
        Consultation c = consultationRepository.save(newConsultation);

        if(c.getId() == 0) return null;

        // 방 정보 조회
        Optional<Consultation> currentConsultation = consultationRepository.findById(c.getId());

        // 참가자 리스트 조회
        List<Participant> list = participantRepository.findByConsultationId(c.getId());

        List<ParticipantResponse> pList = list.stream().map(participant -> {
            Member member = memberRepository.findById(participant.getMemberId())
                    .orElseThrow(() -> new RuntimeException("Member not found"));

            return ParticipantResponse.builder()
                    .id(participant.getId())
                    .memberId(participant.getMemberId())
                    .memberNickname(participant.getMemberNickname())
                    .consultationId(participant.getConsultationId())
                    .consultationDate(participant.getConsultationDate())
                    .profileKey(member.getProfileKey())
                    .profileUrl(member.getProfileUrl())
                    .build();
        }).collect(Collectors.toList());

        RegistRoomResponse registRoomResponse = RegistRoomResponse.builder()
                .id(currentConsultation.get().getId())
                .category(currentConsultation.get().getCategory())
                .title(currentConsultation.get().getTitle())
                .isPrivated(currentConsultation.get().getIsPrivated())
                .password(currentConsultation.get().getPassword())
                .startTime(currentConsultation.get().getStartTime())
                .endTime(currentConsultation.get().getEndTime())
                .currentParticipants(currentConsultation.get().getCurrentParticipants())
                .participants(pList)
                .build();

        return registRoomResponse;
    }

    // 방 리스트에서 참가
    @Transactional
    public JoinRoomResponse joinRoom(JoinRoomRequest joinRoomRequest) {
        Participant newParticipant = Participant.builder()
                .memberId(joinRoomRequest.getMemberId())
                .memberNickname(joinRoomRequest.getMemberNickname())
                .consultationId(joinRoomRequest.getConsultationId())
                .consultationDate(joinRoomRequest.getConsultationDate())
                .build();

        Long id = participantRepository.save(newParticipant).getConsultationId();

        if(id == 0) return null;

        // 방 현재 참가자 수 수정
        Consultation consultation = consultationRepository.findById(id).get();
        consultation.setCurrentParticipants(consultation.getCurrentParticipants() + 1);
        Consultation c = consultationRepository.save(consultation);

        if(c.getId() == 0) return null;

        // 참가자 리스트 조회
        List<Participant> list = participantRepository.findByConsultationId(c.getId());

        List<ParticipantResponse> pList = list.stream().map(participant -> {
            Member member = memberRepository.findById(participant.getMemberId())
                    .orElseThrow(() -> new RuntimeException("Member not found"));

            return ParticipantResponse.builder()
                    .id(participant.getId())
                    .memberId(participant.getMemberId())
                    .memberNickname(participant.getMemberNickname())
                    .consultationId(participant.getConsultationId())
                    .consultationDate(participant.getConsultationDate())
                    .profileKey(member.getProfileKey())
                    .profileUrl(member.getProfileUrl())
                    .build();
        }).collect(Collectors.toList());

        JoinRoomResponse joinRoomResponse = JoinRoomResponse.builder()
                .id(c.getId())
                .category(c.getCategory())
                .title(c.getTitle())
                .isPrivated(c.getIsPrivated())
                .password(c.getPassword())
                .startTime(c.getStartTime())
                .endTime(c.getEndTime())
                .currentParticipants(c.getCurrentParticipants())
                .participants(pList)
                .build();

        return joinRoomResponse;
    }

    @Transactional
    public JoinRandomResponse joinRandom(JoinRandomRequest joinRandomRequest) {
        // 랜덤 방 조회 (조건: 사용자가 선택한 카테고리, 현재 참여 인원이 5 미만인 곳
        Consultation consultation;

        SearchCondition type = joinRandomRequest.getType();

        if(type == null || type == SearchCondition.전체 ) consultation = consultationRepository.findByCurrentParticipantsLessThanEqualOrderByRand(4);

        else if(type != SearchCondition.비밀방) consultation = consultationRepository.findByCategoryAndCurrentParticipantsLessThanEqualOrderByRand(type.name(), 4);

        else return null;

        // 해당 방 id 가져와서 paticipant update
        LocalDate date = consultation.getStartTime().toLocalDate();

        Participant newParticipant = Participant.builder()
                .memberId(joinRandomRequest.getMemberId())
                .memberNickname(joinRandomRequest.getMemberNickname())
                .consultationId(consultation.getId())
                .consultationDate(date)
                .build();

        Long pId = participantRepository.save(newParticipant).getId();

        if(pId == 0) return null;

        // 다시 해당 상담방 update
        consultation.setCurrentParticipants(consultation.getCurrentParticipants()+1);
        Consultation c = consultationRepository.save(consultation);
        
        // 리스트 조회
        List<Participant> list = participantRepository.findByConsultationId(c.getId());
        
        List<ParticipantResponse> pList = list.stream().map(participant -> {
            Member member = memberRepository.findById(participant.getMemberId())
                    .orElseThrow(() -> new RuntimeException("Member not found"));

                    return ParticipantResponse.builder()
                            .id(participant.getId())
                            .memberId(participant.getMemberId())
                            .memberNickname(participant.getMemberNickname())
                            .consultationId(participant.getConsultationId())
                            .consultationDate(participant.getConsultationDate())
                            .profileKey(member.getProfileKey())
                            .profileUrl(member.getProfileUrl())
                            .build();
        }).collect(Collectors.toList());

        
        // Response 파싱
        JoinRandomResponse joinRandomResponse = JoinRandomResponse.builder()
                .id(c.getId())
                .category(c.getCategory())
                .title(c.getTitle())
                .isPrivated(c.getIsPrivated())
                .password(c.getPassword())
                .startTime(c.getStartTime())
                .endTime(c.getEndTime())
                .currentParticipants(c.getCurrentParticipants())
                .participants(pList)
                .build();

        return joinRandomResponse;
    }
}
