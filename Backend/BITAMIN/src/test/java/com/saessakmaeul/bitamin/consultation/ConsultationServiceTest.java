package com.saessakmaeul.bitamin.consultation;

import com.saessakmaeul.bitamin.consultation.Entity.Consultation;
import com.saessakmaeul.bitamin.consultation.Entity.SearchCondition;
import com.saessakmaeul.bitamin.consultation.dto.request.RegistRoomRequest;
import com.saessakmaeul.bitamin.consultation.dto.response.ConsultationListResponse;
import com.saessakmaeul.bitamin.consultation.dto.response.RegistRoomResponse;
import com.saessakmaeul.bitamin.consultation.dto.response.SelectAllResponse;
import com.saessakmaeul.bitamin.consultation.repository.ConsultationRepository;
import com.saessakmaeul.bitamin.consultation.service.ConsultationService;
import com.saessakmaeul.bitamin.member.entity.Member;
import com.saessakmaeul.bitamin.member.entity.Role;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.*;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;
import static org.mockito.ArgumentMatchers.any;

@ExtendWith(MockitoExtension.class)
public class ConsultationServiceTest {
    @Mock
    private ConsultationRepository consultationRepository;

    @InjectMocks
    private ConsultationService consultationService;

    // 멤버 생성
    /*
    * 1. member1
    * 2. member2
    * */
    private Member member1;
    private Member member2;

    // 기존 방 생성
    /*
    * 1. 음악
    * 2. 미술
    * 3. 영화
    * 4. 독서
    * 5. 대화
    * */
    private Consultation music;
    private Consultation art;
    private Consultation movie;
    private Consultation reading;
    private Consultation conversation;
    private Consultation privated;

    @BeforeEach // 테스트 전 처리 (시작 시)
    public void before() {
        member1 = Member.builder()
                .id(1)
                .email("user1@user")
                .password("password")
                .name("user1")
                .nickname("user1")
                .dongCode("1111010200")
                .birthday(new Date(1999, 3, 27))
                .role(Role.ROLE_MEMBER)
                .build();

        member2 = Member.builder()
                .id(2)
                .email("user2@user")
                .password("password")
                .name("user2")
                .nickname("user2")
                .dongCode("1111010200")
                .birthday(new Date(2000, 8, 7))
                .role(Role.ROLE_MEMBER)
                .build();

        music = Consultation.builder()
                .id(1L)
                .category("음악")
                .title("음악 함께 들어요")
                .isPrivated(false)
                .password(null)
                .startTime(LocalDateTime.of(2024, 8, 1, 13, 0, 0))
                .endTime(LocalDateTime.of(2024, 8, 1, 15, 0, 0))
                .currentParticipants(0)
                .sessionId("1")
                .build();

        art = Consultation.builder()
                .id(2L)
                .category("미술")
                .title("그림 함께 그려요")
                .isPrivated(false)
                .password(null)
                .startTime(LocalDateTime.of(2024, 8, 1, 13, 0, 0))
                .endTime(LocalDateTime.of(2024, 8, 1, 15, 0, 0))
                .currentParticipants(0)
                .sessionId("2")
                .build();

        movie = Consultation.builder()
                .id(3L)
                .category("영화")
                .title("영화 함께 보아요")
                .isPrivated(false)
                .password(null)
                .startTime(LocalDateTime.of(2024, 8, 1, 13, 0, 0))
                .endTime(LocalDateTime.of(2024, 8, 1, 15, 0, 0))
                .currentParticipants(0)
                .sessionId("3")
                .build();

        reading = Consultation.builder()
                .id(4L)
                .category("독서")
                .title("책 함께 읽어요")
                .isPrivated(false)
                .password(null)
                .startTime(LocalDateTime.of(2024, 8, 1, 13, 0, 0))
                .endTime(LocalDateTime.of(2024, 8, 1, 15, 0, 0))
                .currentParticipants(0)
                .sessionId("4")
                .build();

        conversation = Consultation.builder()
                .id(5L)
                .category("대화")
                .title("대화 함께 해봐요")
                .isPrivated(false)
                .password(null)
                .startTime(LocalDateTime.of(2024, 8, 1, 13, 0, 0))
                .endTime(LocalDateTime.of(2024, 8, 1, 15, 0, 0))
                .currentParticipants(0)
                .sessionId("5")
                .build();

        privated = Consultation.builder()
                .id(6L)
                .category("음악")
                .title("음악 듣자")
                .isPrivated(true)
                .password("1234")
                .startTime(LocalDateTime.of(2024, 8, 1, 13, 0, 0))
                .endTime(LocalDateTime.of(2024, 8, 1, 15, 0, 0))
                .currentParticipants(0)
                .sessionId("6")
                .build();

        System.out.println("Test start");
    }

    @AfterEach // 테스트 후 처리 (종료 시)
    public void after() {
        System.out.println("Test end");
    }


    // 상담방 전체 조회
    /*
    * 1. 전체 조회
    * 2. 카테고리별 조회 5개
    * 3. 비밀방만 조회
    * */
    @Test
    @DisplayName("전체 조회에 대한 테스트")
    public void selectAll() throws Exception {
        // Given
        Pageable pageable = PageRequest.of(0, 100, Sort.by(Sort.Direction.DESC, "id"));
        SearchCondition type = SearchCondition.전체;

        List<Consultation> consultationList = Arrays.asList(privated, conversation, reading, movie, art, music);
        Page<Consultation> consultationPage = new PageImpl<>(consultationList, pageable, consultationList.size());
        List<ConsultationListResponse> list = Arrays.asList(
                new ConsultationListResponse(privated.getId(), privated.getCategory(), privated.getTitle(), privated.getIsPrivated(), privated.getStartTime(), privated.getEndTime(), privated.getCurrentParticipants(), privated.getSessionId()),
                new ConsultationListResponse(conversation.getId(), conversation.getCategory(), conversation.getTitle(), conversation.getIsPrivated(), conversation.getStartTime(), conversation.getEndTime(), conversation.getCurrentParticipants(), conversation.getSessionId()),
                new ConsultationListResponse(reading.getId(), reading.getCategory(), reading.getTitle(), reading.getIsPrivated(), reading.getStartTime(), reading.getEndTime(), reading.getCurrentParticipants(), reading.getSessionId()),
                new ConsultationListResponse(movie.getId(), movie.getCategory(), movie.getTitle(), movie.getIsPrivated(), movie.getStartTime(), movie.getEndTime(), movie.getCurrentParticipants(), movie.getSessionId()),
                new ConsultationListResponse(art.getId(), art.getCategory(), art.getTitle(), art.getIsPrivated(), art.getStartTime(), art.getEndTime(), art.getCurrentParticipants(), art.getSessionId()),
                new ConsultationListResponse(music.getId(), music.getCategory(), music.getTitle(), music.getIsPrivated(), music.getStartTime(), music.getEndTime(), music.getCurrentParticipants(), music.getSessionId())
        );

        // When
        when(consultationRepository.findBySessionIdIsNotNullAndCurrentParticipantsBetween(1, 4, pageable))
                .thenReturn(consultationPage);

        SelectAllResponse expected = SelectAllResponse.builder()
                .consultationList(list)
                .page(0)
                .size(100)
                .totalElements(consultationPage.getTotalElements())
                .totalPages(consultationPage.getTotalPages())
                .build();

        // Then
        SelectAllResponse actual = consultationService.selectAll(0, 100, type);

        assertEquals(expected, actual);
        System.out.println("전체 조회 성공");
    }

    @Test
    @DisplayName("카테고리 별 조회에 대한 테스트")
    public void selectAllByCategory() throws Exception {
        // Given
        Pageable pageable = PageRequest.of(0, 100, Sort.by(Sort.Direction.DESC, "id"));
        SearchCondition type = SearchCondition.음악;

        List<Consultation> consultationList = Arrays.asList(privated, music);
        Page<Consultation> consultationPage = new PageImpl<>(consultationList, pageable, consultationList.size());
        List<ConsultationListResponse> list = Arrays.asList(
                new ConsultationListResponse(privated.getId(), privated.getCategory(), privated.getTitle(), privated.getIsPrivated(), privated.getStartTime(), privated.getEndTime(), privated.getCurrentParticipants(), privated.getSessionId()),
                new ConsultationListResponse(music.getId(), music.getCategory(), music.getTitle(), music.getIsPrivated(), music.getStartTime(), music.getEndTime(), music.getCurrentParticipants(), music.getSessionId())
        );

        // When
        when(consultationRepository.findByCategoryAndSessionIdIsNotNullAndCurrentParticipantsBetween(type.name(), 1, 4, pageable))
                .thenReturn(consultationPage);

        SelectAllResponse expected = SelectAllResponse.builder()
                .consultationList(list)
                .page(0)
                .size(100)
                .totalElements(consultationPage.getTotalElements())
                .totalPages(consultationPage.getTotalPages())
                .build();

        // Then
        SelectAllResponse actual = consultationService.selectAll(0, 100, type);

        assertEquals(expected, actual);
        System.out.println("음악 성공");
    }

    @Test
    @DisplayName("비밀방 조회에 대한 테스트")
    public void selectAllByPrivated() throws Exception {
        // Given
        Pageable pageable = PageRequest.of(0, 100, Sort.by(Sort.Direction.DESC, "id"));
        SearchCondition type = SearchCondition.비밀방;

        List<Consultation> consultationList = Arrays.asList(privated);
        Page<Consultation> consultationPage = new PageImpl<>(consultationList, pageable, consultationList.size());
        List<ConsultationListResponse> list = Arrays.asList(
                new ConsultationListResponse(privated.getId(), privated.getCategory(), privated.getTitle(), privated.getIsPrivated(), privated.getStartTime(), privated.getEndTime(), privated.getCurrentParticipants(), privated.getSessionId())
        );

        // When
        when(consultationRepository.findByIsPrivatedAndSessionIdIsNotNullAndCurrentParticipantsBetween(true,1,  4, pageable))
                .thenReturn(consultationPage);

        SelectAllResponse expected = SelectAllResponse.builder()
                .consultationList(list)
                .page(0)
                .size(100)
                .totalElements(consultationPage.getTotalElements())
                .totalPages(consultationPage.getTotalPages())
                .build();

        // Then
        SelectAllResponse actual = consultationService.selectAll(0, 100, type);

        assertEquals(expected, actual);
        System.out.println("비밀방 조회 성공");
    }

    @Test
    @DisplayName("상담 방 생성에 대한 테스트")
    public void registRoom() throws Exception {
        // Given
        RegistRoomRequest registRoomRequest = RegistRoomRequest.builder()
                .category("미술")
                .title("서로 얼굴 그려주기 해요~~")
                .isPrivated(false)
                .password(null)
                .startTime(LocalDateTime.of(2024, 8, 2, 9, 30, 0))
                .endTime(LocalDateTime.of(2024, 8, 2, 11, 30, 0))
                .sessionId("7")
                .build();

        Consultation consultation = Consultation.builder()
                .id(7L)
                .category("미술")
                .title("서로 얼굴 그려주기 해요~~")
                .isPrivated(false)
                .password(null)
                .startTime(LocalDateTime.of(2024, 8, 2, 9, 30, 0))
                .endTime(LocalDateTime.of(2024, 8, 2, 11, 30, 0))
                .sessionId("7")
                .build();

        // When
        when(consultationRepository.save(any(Consultation.class))).thenReturn(consultation);

        RegistRoomResponse expected = RegistRoomResponse.builder()
                .id(consultation.getId())
                .isPrivated(consultation.getIsPrivated())
                .password(consultation.getPassword())
                .startTime(consultation.getStartTime())
                .sessionId(consultation.getSessionId())
                .build();

        // Then
        RegistRoomResponse actual = consultationService.registRoom(registRoomRequest);

        assertEquals(expected, actual);
        System.out.println("상담 방 생성 성공");
    }
}
