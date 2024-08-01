package com.saessakmaeul.bitamin.consultation.service;

import com.saessakmaeul.bitamin.consultation.Entity.ChatingLog;
import com.saessakmaeul.bitamin.consultation.Entity.Consultation;
import com.saessakmaeul.bitamin.consultation.Entity.Participant;
import com.saessakmaeul.bitamin.consultation.Entity.SearchCondition;
import com.saessakmaeul.bitamin.consultation.dto.request.*;
import com.saessakmaeul.bitamin.consultation.dto.response.*;
import com.saessakmaeul.bitamin.consultation.repository.ChatingLogRepository;
import com.saessakmaeul.bitamin.consultation.repository.ConsultationRepository;
import com.saessakmaeul.bitamin.consultation.repository.ParticipantRepository;
import com.saessakmaeul.bitamin.member.entity.Member;
import com.saessakmaeul.bitamin.member.repository.MemberRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
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
    public SelectAllResponse selectAll(int page, int size, SearchCondition type) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));
        Page<Consultation> consultationPage;

        if(type == null || type == SearchCondition.전체 ) consultationPage = consultationRepository.findBySessionIdIsNotNullAndCurrentParticipantsBetween(1,4, pageable);

        else if(type == SearchCondition.비밀방) consultationPage = consultationRepository.findByIsPrivatedAndSessionIdIsNotNullAndCurrentParticipantsBetween(true, 1,4, pageable);

        else consultationPage = consultationRepository.findByCategoryAndSessionIdIsNotNullAndCurrentParticipantsBetween(type.name(), 1, 4, pageable);

        List<ConsultationListResponse> list  = consultationPage.getContent().stream()
                .map(domain -> new ConsultationListResponse(
                        domain.getId(),
                        domain.getCategory(),
                        domain.getTitle(),
                        domain.getIsPrivated(),
                        domain.getStartTime(),
                        domain.getEndTime(),
                        domain.getCurrentParticipants(),
                        domain.getSessionId()
                ))
                .toList();

        return SelectAllResponse.builder()
                .consultationList(list)
                .page(page)
                .size(size)
                .totalElements(consultationPage.getTotalElements())
                .totalPages(consultationPage.getTotalPages())
                .build();

//        return  consultationPage.getContent().stream()
//                .map(domain -> new SelectAllResponse(
//                        domain.getId(),
//                        domain.getCategory(),
//                        domain.getTitle(),
//                        domain.getIsPrivated(),
//                        domain.getStartTime(),
//                        domain.getEndTime(),
//                        domain.getCurrentParticipants(),
//                        domain.getSessionId(),
//                        page,
//                        size,
//                        consultationPage.getTotalElements(),
//                        consultationPage.getTotalPages()
//                ))
//                .collect(Collectors.toList());
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
//                .currentParticipants(0)
                .sessionId(registRoomRequest.getSessionId())
                .build();

        Consultation newConsultation;

        try {
            newConsultation = consultationRepository.save(consultation);
        } catch (RuntimeException e) {
            throw new RuntimeException("db 오류 rollback");
        }

        return RegistRoomResponse.builder()
                .id(newConsultation.getId())
                .startTime(newConsultation.getStartTime())
                .isPrivated(newConsultation.getIsPrivated())
                .password(newConsultation.getPassword())
                .sessionId(newConsultation.getSessionId())
                .build();
    }

    // 방 리스트에서 참가
    @Transactional
    public JoinRoomResponse joinRoom(JoinRoomRequest joinRoomRequest) {
        Participant newParticipant = Participant.builder()
                .memberId(joinRoomRequest.getMemberId())
                .memberNickname(joinRoomRequest.getMemberNickname())
                .consultationId(joinRoomRequest.getId())
                .consultationDate(joinRoomRequest.getConsultationDate())
                .build();

        Optional<Consultation> consultation = consultationRepository.findById(joinRoomRequest.getId());

        if(consultation.isEmpty()) return null;

        if(consultation.get().getCurrentParticipants() >= 5) return null;

        // 비밀번호 확인
        if(consultation.get().getIsPrivated()) {
            if(!consultation.get().getPassword().equals(joinRoomRequest.getPassword())) return null;
        }

        Participant participant;

        try {
            participant = participantRepository.save(newParticipant);
        } catch (RuntimeException e) {
            throw new RuntimeException("db 오류 rollback");
        }

        // 방 현재 참가자 수 수정
        consultation.get().setCurrentParticipants(consultation.get().getCurrentParticipants() + 1);

        try {
            consultationRepository.save(consultation.get());
        } catch (RuntimeException e) {
            throw new RuntimeException("db 오류 rollback");
        }

        Optional<Member> member = memberRepository.findById(newParticipant.getMemberId());

        if(member.isEmpty()) return null;

        return JoinRoomResponse.builder()
                .consultationId(consultation.get().getId())
                .id(participant.getId())
                .memberId(member.get().getId())
                .memberNickname(member.get().getNickname())
                .profileKey(member.get().getProfileKey())
                .profileUrl(member.get().getProfileUrl())
                .build();
    }

    public Map<String, Object> findRandomSessionId(JoinRandomRequest joinRandomRequest) {
        SearchCondition type = joinRandomRequest.getType();
        Optional<Consultation> consultation;

        if(type == null || type == SearchCondition.전체 ) consultation = consultationRepository.findByCurrentParticipantsLessThanEqualOrderByRand(4);

        else if(type != SearchCondition.비밀방) consultation = consultationRepository.findByCategoryAndCurrentParticipantsLessThanEqualOrderByRand(type.name(), 4);

        else return null;

        if(consultation.isEmpty()) return null;

        Map<String, Object> map = new HashMap<>();
        map.put("id", consultation.get().getId());
        map.put("sessionId", consultation.get().getSessionId());
        map.put("consultationDate", consultation.get().getStartTime());

        return map;
    }

    // 랜덤 방 조회 (조건: 사용자가 선택한 카테고리, 현재 참여 인원이 5 미만인 곳
    @Transactional
    public JoinRandomResponse joinRandom(JoinRandomRequest joinRandomRequest) {
        Optional<Consultation> consultation = consultationRepository.findById(joinRandomRequest.getId());

        if(consultation.isEmpty()) return null;

        Participant newParticipant = Participant.builder()
                .memberId(joinRandomRequest.getMemberId())
                .memberNickname(joinRandomRequest.getMemberNickname())
                .consultationId(joinRandomRequest.getId())
                .consultationDate(joinRandomRequest.getConsultationDate())
                .build();

        Participant participant;

        try {
            participant = participantRepository.save(newParticipant);
        } catch (RuntimeException e) {
            throw new RuntimeException("db 오류 rollback");
        }

        // 다시 해당 상담방 update
        consultation.get().setCurrentParticipants(consultation.get().getCurrentParticipants()+1);

        try {
            consultationRepository.save(consultation.get());
        } catch (RuntimeException e) {
            throw new RuntimeException("db 오류 rollback");
        }

        Optional<Member> member = memberRepository.findById(newParticipant.getMemberId());

        if(member.isEmpty()) return null;

        return JoinRandomResponse.builder()
                .consultationId(consultation.get().getId())
                .id(participant.getId())
                .memberId(member.get().getId())
                .memberNickname(member.get().getNickname())
                .profileKey(member.get().getProfileKey())
                .profileUrl(member.get().getProfileUrl())
                .build();
    }

    // 회의 시작 전 퇴장
    @Transactional
    public int exitRoomBeforeStart(ExitRoomBeforeStartRequest exitRoomBeforeStartRequest) {
        Optional<Participant> participant = participantRepository.findByMemberIdAndConsultationId(exitRoomBeforeStartRequest.getMemberId(), exitRoomBeforeStartRequest.getConsultationId());

        if(participant.isEmpty()) return 0;

        try {
            participantRepository.delete(participant.get());
        } catch (RuntimeException e) {
            throw new RuntimeException("db 오류 rollback");
        }

        Optional<Consultation> consultation = consultationRepository.findById(exitRoomBeforeStartRequest.getConsultationId());

        if(consultation.isEmpty()) return 0;

        consultation.get().setCurrentParticipants(consultation.get().getCurrentParticipants() - 1);

        if(consultation.get().getCurrentParticipants() == 0) {
            try {
                consultationRepository.delete(consultation.get());
            } catch (RuntimeException e) {
                throw new RuntimeException("db 오류 rollback");
            }

            return 1;
        }

        try {
            consultationRepository.save(consultation.get());
        } catch (RuntimeException e) {
            throw new RuntimeException("db 오류 rollback");
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

        if(consultation.get().getCurrentParticipants() == 0) consultation.get().setSessionId(null);

        try {
            consultationRepository.save(consultation.get());
        } catch (RuntimeException e) {
            throw new RuntimeException("db 오류 rollback");
        }

        return 1;
    }

    // 채팅 조회
    public List<findChatingResponse> findChating(Long consultationId) {
        List<ChatingLog> chatingLog = chatingLogRepository.findByConsultationId(consultationId);

        return chatingLog.stream()
                .map(chating -> findChatingResponse.builder()
                        .id(chating.getId())
                        .content(chating.getContent())
                        .memberId(chating.getMemberId())
                        .memberNickname(chating.getMemberNickname())
                        .sendTime(chating.getSendTime())
                        .consultationId(chating.getConsultationId())
                        .build()
                )
                .collect(Collectors.toList());
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
        } catch (RuntimeException e) {
            throw new RuntimeException("db 오류 rollback");
        }

        return 1;
    }

    // 만약 나중에 Broadcast 필요한 상황이 오면 구현
//    public BroadcastInformationResponse broadcastInformation(Long id) {
//        Optional<Consultation> consultation = consultationRepository.findById(id);
//
//        if(consultation.isEmpty()) return null;
//
//        // 참가자 리스트 조회
//        List<Participant> list = participantRepository.findByConsultationId(consultation.get().getId());
//
//        List<ParticipantResponse> pList = list.stream().map(participant -> {
//            Member member = memberRepository.findById(participant.getMemberId())
//                    .orElseThrow(() -> new RuntimeException("Member not found"));
//
//            return ParticipantResponse.builder()
//                    .id(participant.getId())
//                    .memberId(participant.getMemberId())
//                    .memberNickname(participant.getMemberNickname())
//                    .consultationId(participant.getConsultationId())
//                    .consultationDate(participant.getConsultationDate())
//                    .profileKey(member.getProfileKey())
//                    .profileUrl(member.getProfileUrl())
//                    .build();
//        }).collect(Collectors.toList());
//
//        return BroadcastInformationResponse.builder()
//                .id(consultation.get().getId())
//                .category(consultation.get().getCategory())
//                .title(consultation.get().getTitle())
//                .isPrivated(consultation.get().getIsPrivated())
//                .password(consultation.get().getPassword())
//                .startTime(consultation.get().getStartTime())
//                .endTime(consultation.get().getEndTime())
//                .currentParticipants(consultation.get().getCurrentParticipants())
//                .participants(pList)
//                .build();
//    }
}
