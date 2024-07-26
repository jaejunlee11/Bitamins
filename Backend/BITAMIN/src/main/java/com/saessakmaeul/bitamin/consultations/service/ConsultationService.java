package com.saessakmaeul.bitamin.consultations.service;

import com.saessakmaeul.bitamin.consultations.Entity.ChatingLog;
import com.saessakmaeul.bitamin.consultations.Entity.Consultation;
import com.saessakmaeul.bitamin.consultations.Entity.Participant;
import com.saessakmaeul.bitamin.consultations.Entity.SearchCondition;
import com.saessakmaeul.bitamin.consultations.dto.request.*;
import com.saessakmaeul.bitamin.consultations.dto.response.*;
import com.saessakmaeul.bitamin.consultations.repository.ChatingLogRepository;
import com.saessakmaeul.bitamin.consultations.repository.ConsultationRepository;
import com.saessakmaeul.bitamin.consultations.repository.ParticipantRepository;
import com.saessakmaeul.bitamin.member.entity.Member;
import com.saessakmaeul.bitamin.member.repository.MemberRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.EmptyResultDataAccessException;
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
    private final ChatingLogRepository chatingLogRepository;

    // 방 리스트 조회
    public List<SelectAllResponse> selectAll(int page, int size, SearchCondition type) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));
        Page<Consultation> consultationPage;

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
                .isPrivated(registRoomRequest.getIsPrivated())
                .password(registRoomRequest.getPassword())
                .startTime(registRoomRequest.getStartTime())
                .endTime(registRoomRequest.getEndTime())
                .build();

        Consultation newConsultation;
        try {
            newConsultation= consultationRepository.save(consultation);
        } catch (Exception e) {
            return null;
        }

        // 참가자 등록
        LocalDate date = newConsultation.getStartTime().toLocalDate();

        Participant newParticipant = Participant.builder()
                .memberId(registRoomRequest.getMemberId())
                .memberNickname(registRoomRequest.getMemberNickname())
                .consultationId(newConsultation.getId())
                .consultationDate(date)
                .build();

        try {
            participantRepository.save(newParticipant);
        } catch (Exception e) {
            return null;
        }

        // 방 현재 참가자 수 수정
        newConsultation.setCurrentParticipants(newConsultation.getCurrentParticipants() + 1);

        Consultation c;
        try {
            c = consultationRepository.save(newConsultation);
        }  catch (Exception e) {
            return null;
        }

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

        Participant participant;

        try {
            participant = participantRepository.save(newParticipant);
        } catch (Exception e) {
            return null;
        }

        // 방 현재 참가자 수 수정
        Optional<Consultation> consultation = consultationRepository.findById(participant.getConsultationId());

        if(consultation.isEmpty()) return null;

        consultation.get().setCurrentParticipants(consultation.get().getCurrentParticipants() + 1);

        Consultation c;

        try {
            c = consultationRepository.save(consultation.get());
        } catch (Exception e) {
            return null;
        }

        // 참가자 리스트 조회
        List<Participant> list = participantRepository.findByConsultationId(c.getId());

        List<ParticipantResponse> pList = list.stream().map(p -> {
            Member member = memberRepository.findById(p.getMemberId())
                    .orElseThrow(() -> new RuntimeException("Member not found"));

            return ParticipantResponse.builder()
                    .id(p.getId())
                    .memberId(p.getMemberId())
                    .memberNickname(p.getMemberNickname())
                    .consultationId(p.getConsultationId())
                    .consultationDate(p.getConsultationDate())
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

    // 랜덤 방 조회 (조건: 사용자가 선택한 카테고리, 현재 참여 인원이 5 미만인 곳
    @Transactional
    public JoinRandomResponse joinRandom(JoinRandomRequest joinRandomRequest) {
        Optional<Consultation> consultation;

        SearchCondition type = joinRandomRequest.getType();

        if(type == null || type == SearchCondition.전체 ) consultation = consultationRepository.findByCurrentParticipantsLessThanEqualOrderByRand(4);

        else if(type != SearchCondition.비밀방) consultation = consultationRepository.findByCategoryAndCurrentParticipantsLessThanEqualOrderByRand(type.name(), 4);

        else return null;

        // 해당 방 id 가져와서 paticipant update
        LocalDate date = consultation.get().getStartTime().toLocalDate();

        Participant newParticipant = Participant.builder()
                .memberId(joinRandomRequest.getMemberId())
                .memberNickname(joinRandomRequest.getMemberNickname())
                .consultationId(consultation.get().getId())
                .consultationDate(date)
                .build();

        try {
            participantRepository.save(newParticipant);
        }
        catch (Exception e) {
            return null;
        }

        // 다시 해당 상담방 update
        consultation.get().setCurrentParticipants(consultation.get().getCurrentParticipants()+1);

        Consultation c;

        try {
            c = consultationRepository.save(consultation.get());
        } catch (Exception e) {
            return null;
        }

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

    // 회의 시작 전 퇴장
    @Transactional
    public int exitRoomBeforeStart(ExitRoomBeforeStartRequest exitRoomBeforeStartRequest) {
        Optional<Participant> participant = participantRepository.findByMemberIdAndConsultationId(exitRoomBeforeStartRequest.getMemberId(), exitRoomBeforeStartRequest.getConsultationId());

        if(participant.isEmpty()) return 0;

        try {
            participantRepository.delete(participant.get());
        } catch (EmptyResultDataAccessException e) {
            return 0;
        }

        Optional<Consultation> consultation = consultationRepository.findById(exitRoomBeforeStartRequest.getConsultationId());

        consultation.get().setCurrentParticipants(consultation.get().getCurrentParticipants() - 1);

        if(consultation.get().getCurrentParticipants() == 0) {
            try {
                consultationRepository.delete(consultation.get());
            } catch (Exception e) {
                return 0;
            }

            return 1;
        }

        try {
            consultationRepository.save(consultation.get());
        } catch (Exception e) {
            return 0;
        }

        return 1;
    }

    // 회의 시작 후 퇴장
    public int exitRoomAfterStart(ExitRoomAfterStartRequest exitRoomAfterStartRequest) {
        Optional<Participant> participant = participantRepository.findByMemberIdAndConsultationId(exitRoomAfterStartRequest.getMemberId(), exitRoomAfterStartRequest.getConsultationId());

        if(participant.isEmpty()) return 0;

        Optional<Consultation> consultation = consultationRepository.findById(exitRoomAfterStartRequest.getConsultationId());

        if(consultation.isEmpty()) return 0;

        consultation.get().setCurrentParticipants(consultation.get().getCurrentParticipants() - 1);

        try {
            consultationRepository.save(consultation.get());
        } catch (Exception e) {
            return 0;
        }

        return 1;
    }

    // 채팅 조회
    public List<FindByIdResponse> findById(Long consultationId) {
        List<ChatingLog> chatingLog = chatingLogRepository.findByConsultationId(consultationId);

        List<FindByIdResponse> findByIdResponse = chatingLog.stream()
                .map(chating -> FindByIdResponse.builder()
                        .id(chating.getId())
                        .content(chating.getContent())
                        .memberId(chating.getMemberId())
                        .memberNickname(chating.getMemberNickname())
                        .sendTime(chating.getSendTime())
                        .consultationId(chating.getConsultationId())
                        .build()
                )
                .collect(Collectors.toList());

        return findByIdResponse;
    }

    // 채팅 등록
    public int registChating(RegistChatingRequest registChatingRequest) {
        Optional<Participant> participant = participantRepository.findByMemberIdAndConsultationId(registChatingRequest.getMemberId(), registChatingRequest.getConsultationId());

        if(participant.isEmpty()) return 0;

        ChatingLog chatingLog = ChatingLog.builder()
                .consultationId(registChatingRequest.getConsultationId())
                .memberId(registChatingRequest.getMemberId())
                .memberNickname(registChatingRequest.getMemberNickname())
                .content(registChatingRequest.getContent())
                .build();

        try {
            chatingLogRepository.save(chatingLog);
        } catch (Exception e) {
            return 0;
        }

        return 1;
    }
}
