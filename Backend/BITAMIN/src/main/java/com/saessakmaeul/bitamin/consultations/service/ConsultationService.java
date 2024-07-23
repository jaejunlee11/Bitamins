package com.saessakmaeul.bitamin.consultations.service;

import com.saessakmaeul.bitamin.consultations.Entity.Consultation;
import com.saessakmaeul.bitamin.consultations.Entity.Participant;
import com.saessakmaeul.bitamin.consultations.Entity.SerchCondition;
import com.saessakmaeul.bitamin.consultations.dto.request.JoinRoomRequest;
import com.saessakmaeul.bitamin.consultations.dto.request.RegistRoomRequest;
import com.saessakmaeul.bitamin.consultations.dto.response.JoinRoomResponse;
import com.saessakmaeul.bitamin.consultations.dto.response.ParticipantResponse;
import com.saessakmaeul.bitamin.consultations.dto.response.RegistRoomResponse;
import com.saessakmaeul.bitamin.consultations.dto.response.SelectAllResponse;
import com.saessakmaeul.bitamin.consultations.repository.ConsultationRepository;
import com.saessakmaeul.bitamin.consultations.repository.ParticipantRepository;
import com.saessakmaeul.bitamin.member.entity.Member;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ConsultationService {
    private final ConsultationRepository consultationRepository;
    private final ParticipantRepository participantRepository;

    // 방 리스트 조회
    public List<SelectAllResponse> selectAll(int page, int size, SerchCondition type) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));
        Page<Consultation> consultationPage;

        System.out.println("Service");

        if(type == null || type == SerchCondition.전체 ) consultationPage = consultationRepository.findAll(pageable);

        else if(type == SerchCondition.비밀방) consultationPage = consultationRepository.findByIsPrivated(1, pageable);

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

        Long id = consultationRepository.save(consultation).getId();

        System.out.println(id);

        if(id == 0) return null;

        // 참가자 등록
        Participant newParticipant = Participant.builder()
                .memberId(registRoomRequest.getMemberId())
                .memberNickname(registRoomRequest.getMemberNickname())
                .consultationId(id)
                .consultationDate(registRoomRequest.getConsultationDate())
                .build();

        Long pId = participantRepository.save(newParticipant).getId();

        if(pId == 0) return null;

        // 방 현재 참가자 수 수정
        Consultation updatedConsultation = consultationRepository.findById(id).get();
        updatedConsultation.setCurrentParticipants(updatedConsultation.getCurrentParticipants() + 1);
        consultationRepository.save(updatedConsultation);

        // 방 정보 조회
        Optional<Consultation> currentConsultation = consultationRepository.findById(id);

        // 참가자 리스트 조회
        List<Participant> list = participantRepository.findByConsultationId(id);

        List<ParticipantResponse> pList = list.stream()
                .map(participant -> ParticipantResponse.builder()
                        .id(participant.getId())
                        .memberId(participant.getMemberId())
                        .memberNickname(participant.getMemberNickname())
                        .consultationId(participant.getConsultationId())
                        .consultationDate(participant.getConsultationDate())
                        .build())
                .collect(Collectors.toList());

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
        Consultation updatedConsultation = consultationRepository.findById(id).get();
        updatedConsultation.setCurrentParticipants(updatedConsultation.getCurrentParticipants() + 1);
        consultationRepository.save(updatedConsultation);

        // 방 정보 조회
        Optional<Consultation> currentConsultation = consultationRepository.findById(id);

        // 참가자 리스트 조회
        List<Participant> list = participantRepository.findByConsultationId(id);

        List<ParticipantResponse> pList = list.stream()
                .map(participant -> ParticipantResponse.builder()
                        .id(participant.getId())
                        .memberId(participant.getMemberId())
                        .memberNickname(participant.getMemberNickname())
                        .consultationId(participant.getConsultationId())
                        .consultationDate(participant.getConsultationDate())
                        .build())
                .collect(Collectors.toList());

        JoinRoomResponse joinRoomResponse = JoinRoomResponse.builder()
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

        return joinRoomResponse;
    }
}
