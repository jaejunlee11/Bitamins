package com.saessakmaeul.bitamin.consultation.controller;

import com.saessakmaeul.bitamin.consultation.Entity.SearchCondition;
import com.saessakmaeul.bitamin.consultation.dto.request.*;
import com.saessakmaeul.bitamin.consultation.dto.response.*;
import com.saessakmaeul.bitamin.consultation.service.ConsultationService;
import com.saessakmaeul.bitamin.consultation.service.GptService;
import com.saessakmaeul.bitamin.util.JwtUtil;
import io.openvidu.java.client.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
//import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/consultations")
@RequiredArgsConstructor
public class ConsultationController {
    private final OpenVidu openVidu;
    // Broadcast 필요한 상황 오면 구현
//    private final SimpMessagingTemplate simpMessagingTemplate;
    private final ConsultationService consultationService;
    private final GptService GptService;
    private final JwtUtil jwtUtil;

    @GetMapping
    public ResponseEntity<?> selectAll(@RequestParam(value = "page", defaultValue = "0") int page,
                                       @RequestParam(value = "size", defaultValue = "100") int size,
                                       @RequestParam(value = "type") SearchCondition type) {
        SelectAllResponse consultationList = consultationService.selectAll(page, size, type);

        if(consultationList == null) return ResponseEntity.status(404).body("다시 조회하세요");

        return ResponseEntity.ok(consultationList);
    }

    @PostMapping
    public ResponseEntity<?> registRoom(@RequestBody RegistRoomRequest registRoomRequest) throws OpenViduJavaClientException, OpenViduHttpException {
        Map<String,Object> params = new HashMap<>();

        params.put("customSessionId", UUID.randomUUID().toString());

        SessionProperties properties = SessionProperties.fromJson(params).build();

        Session session = openVidu.createSession(properties);

        registRoomRequest.setSessionId(session.getSessionId());

        RegistRoomResponse registRoomResponse = consultationService.registRoom(registRoomRequest);

        if(registRoomResponse == null) return ResponseEntity.status(404).body("방이 생성되지 않았습니다.");

        return ResponseEntity.status(201).body(registRoomResponse);

    }

    @PostMapping("/participants")
    public ResponseEntity<?> joinRoom(@RequestHeader(value = "Authorization", required = false) String tokenHeader,
                                      @RequestBody JoinRoomRequest joinRoomRequest) throws OpenViduJavaClientException, OpenViduHttpException {
        Map<String,Object> params = new HashMap<>();

        // 입장 가능한 세션인지 확인
        Session session = openVidu.getActiveSession(joinRoomRequest.getSessionId());

        if (session == null) return ResponseEntity.status(404).body("못 찾음");

        // DB에 저장
        Long memberId = jwtUtil.extractUserId(tokenHeader.substring(7));
        String memberNickname = jwtUtil.extractNickname(tokenHeader.substring(7));

        joinRoomRequest.setMemberId(memberId);
        joinRoomRequest.setMemberNickname(memberNickname);
        joinRoomRequest.setConsultationDate(joinRoomRequest.getStartTime().toLocalDate());

        JoinRoomResponse joinRoomResponse = consultationService.joinRoom(joinRoomRequest);

        if(joinRoomResponse == null) return ResponseEntity.status(404).body("방에 참여되지 않았습니다.");

        // connection 생성
        ConnectionProperties properties = ConnectionProperties.fromJson(params).build();
        Connection connection = session.createConnection(properties);

        joinRoomResponse.setToken(connection.getToken());

        return ResponseEntity.status(200).body(joinRoomResponse);
    }

    @PostMapping("/random-participants")
    public ResponseEntity<?> joinRandom(@RequestHeader(value = "Authorization", required = false) String tokenHeader,
                                        @RequestBody JoinRandomRequest joinRandomRequest) throws OpenViduJavaClientException, OpenViduHttpException{
        Map<String,Object> params = new HashMap<>();

        Map<String, Object> map = consultationService.findRandomSessionId(joinRandomRequest);

        if(map == null) return ResponseEntity.status(404).body("방 없음");

        joinRandomRequest.setSessionId(map.get("sessionId").toString());
        joinRandomRequest.setId(Long.parseLong(map.get("id").toString()));
        joinRandomRequest.setConsultationDate(((LocalDateTime)map.get("consultationDate")).toLocalDate());

        // 입장 가능한 세션인지 확인
        Session session = openVidu.getActiveSession(joinRandomRequest.getSessionId());

        if (session == null) return ResponseEntity.status(404).body("못 찾음");

        // DB에 저장
        Long memberId = jwtUtil.extractUserId(tokenHeader.substring(7));
        String memberNickname = jwtUtil.extractNickname(tokenHeader.substring(7));

        joinRandomRequest.setMemberId(memberId);
        joinRandomRequest.setMemberNickname(memberNickname);

        JoinRandomResponse joinRandomResponse = consultationService.joinRandom(joinRandomRequest);

        if(joinRandomResponse == null) return ResponseEntity.status(404).body("방에 참여되지 않았습니다.");

        // connection 생성
        ConnectionProperties properties = ConnectionProperties.fromJson(params).build();
        Connection connection = session.createConnection(properties);

        joinRandomResponse.setToken(connection.getToken());

        return ResponseEntity.status(200).body(joinRandomResponse);
    }

    @DeleteMapping("{consultationId}")
    public ResponseEntity<?> ExitRoomBeforeStart(@RequestHeader(value = "Authorization", required = false) String tokenHeader,
                                                 @PathVariable("consultationId") Long consultationId) {
        Long memberId = jwtUtil.extractUserId(tokenHeader.substring(7));

        ExitRoomBeforeStartRequest exitRoomBeforeStartRequest = new ExitRoomBeforeStartRequest(memberId, consultationId);

        int result = consultationService.exitRoomBeforeStart(exitRoomBeforeStartRequest);

        if(result == 0) return ResponseEntity.status(404).body("퇴장하지 못 했습니다.");

        return ResponseEntity.status(200).body("정상적으로 퇴장 처리 되었습니다.");
    }

    @PatchMapping
    public ResponseEntity<?> ExitRoomAfterStart(@RequestHeader(value = "Authorization", required = false) String tokenHeader,
                                                @RequestBody ExitRoomAfterStartRequest exitRoomAfterStartRequest) {
        Long memberId = jwtUtil.extractUserId(tokenHeader.substring(7));

        exitRoomAfterStartRequest.setMemberId(memberId);

        int result = consultationService.exitRoomAfterStart(exitRoomAfterStartRequest);

        if(result == 0) return ResponseEntity.status(404).body("퇴장하지 못했습니다.");

        return ResponseEntity.status(200).body("정상적으로 퇴장 처리 되었습니다.");
    }

    @GetMapping("/chatings/{consultationId}")
    public ResponseEntity<?> findChating(@PathVariable("consultationId") Long consultationId) {
        List<findChatingResponse> chatingList = consultationService.findChating(consultationId);

        return ResponseEntity.status(200).body(chatingList);
    }

    @PostMapping("/chatings")
    public ResponseEntity<?> registChating(@RequestHeader(value = "Authorization", required = false) String tokenHeader,
                                           @RequestBody RegistChatingRequest registChatingRequest) {
        Long memberId = jwtUtil.extractUserId(tokenHeader.substring(7));
        String memberNickname = jwtUtil.extractNickname(tokenHeader.substring(7));

        registChatingRequest.setMemberId(memberId);
        registChatingRequest.setMemberNickname(memberNickname);

        int result = consultationService.registChating(registChatingRequest);

        if(result == 0) return ResponseEntity.status(404).body("채팅이 저장되지 않았습니다.");

        return ResponseEntity.status(200).body("정상적으로 채팅이 저장되었습니다.");
    }

    @PostMapping("/moderators/{category}")
    public ResponseEntity<?> selectPrompt(@RequestHeader(value = "Authorization", required = false) String tokenHeader,
                                          @PathVariable("category") SearchCondition category,
                                          @RequestBody GptCompletion gptCompletion) {
        String nickname = jwtUtil.extractNickname(tokenHeader.substring(7));
        gptCompletion.setModel("gpt-4o-mini");

        switch (category) {
            case 음악 :
                gptCompletion.getMessages().add(0, new GptRequest("system", "번호를 이야기하면 여기에 정리해 놓은 번호에 대한 문장을 그대로 답변해 줘.\n" +
                        "1. 안녕하세요. 저는 여러분과 함께 시간을 보낼 귤귤이에요! 지금부터 함께 상담을 시작해 볼까요?\n" +
                        "2. 먼저, 우리 " + nickname + "님부터 이번 주 나의 감정이 어땠는지 되돌아봐요! 좋았던 기억, 힘들었던 일 등 어떤 주제도 좋으니 이야기해 주세요!\n" +
                        "3. 모두 한 주간 고생 많았어요! 대화를 통해 내가 어떤 생각을 했었는지를 알아보는 시간이 되었길 바라요. 이번에는 서로 좋아하는 음악을 소개해 볼까요? 소개가 끝나면 함께 들어봐요!\n" +
                        "4. 진짜 좋은 곡들이 많군요! 음악의 힘은 정말 대단한 것 같아요! 저도 힘들 때 음악을 들으면 내가 공감받고 있다는 느낌을 받거든요! 마지막으로 오늘 상담이 어땠는지 서로 이야기해 봐요!\n" +
                        "5. 이제 인사하고 마무리할게요! 뜻깊은 시간이 되었기를 바라요. 오늘 함께 했던 분과 다음에도 상담하고 싶다면, 쪽지를 보내 약속을 잡아도 좋아요! 다음에 만날 때까지 행복한 하루 보내세요!"));
                break;
            case 미술 :
                gptCompletion.getMessages().add(0, new GptRequest("system", "번호를 이야기하면 여기에 정리해 놓은 번호에 대한 문장을 그대로 답변해 줘.\n" +
                        "1. 안녕하세요. 저는 여러분과 함께 시간을 보낼 귤귤이에요! 지금부터 함께 상담을 시작해 볼까요?\n" +
                        "2. 먼저, 우리 " + nickname + "님부터 이번 주 나의 감정이 어땠는지 되돌아봐요! 좋았던 기억, 힘들었던 일 등 어떤 주제도 좋으니 이야기해 주세요!\n" +
                        "3. 모두 한 주간 고생 많았어요! 대화를 통해 내가 어떤 생각을 했었는지를 알아보는 시간이 되었길 바라요. 이번에는 그림판을 이용해 그림을 그려 볼까요? 어떤 그림이든 좋아요! 다 그리면 진행 버튼을 눌러주세요!\n" +
                        "4. " + nickname + "님부터 한 분씩 화면공유를 통해 그림에 관해 설명해주세요!\n" +
                        "5. 정말 예쁜 그림이네요! 그림을 그리면서, 서로의 그림에 대해 대화를 나누면서 재미있는 시간이 되었을 거라고 생각해요! 그림을 그리며 마음을 차분히 가라앉히는 건 뜻 깊은 시간이거든요! 마지막으로 오늘 상담이 어땠는지 서로 이야기해 봐요!\n" +
                        "6. 이제 인사하고 마무리할게요! 뜻깊은 시간이 되었기를 바라요. 오늘 함께 했던 분과 다음에도 상담하고 싶다면, 쪽지를 보내 약속을 잡아도 좋아요! 다음에 만날 때까지 행복한 하루 보내세요!"));
                break;
            case 영화 :
                gptCompletion.getMessages().add(0, new GptRequest("system", "번호를 이야기하면 여기에 정리해 놓은 번호에 대한 문장을 그대로 답변해 줘.\n" +
                        "1. 안녕하세요. 저는 여러분과 함께 시간을 보낼 귤귤이에요! 지금부터 함께 상담을 시작해 볼까요?\n" +
                        "2. 먼저, 우리 " + nickname + "님부터 이번 주 나의 감정이 어땠는지 되돌아봐요! 좋았던 기억, 힘들었던 일 등 어떤 주제도 좋으니 이야기해 주세요!\n" +
                        "3. 모두 한 주간 고생 많았어요! 대화를 통해 내가 어떤 생각을 했었는지를 알아보는 시간이 되었길 바라요. 이번에는 서로 좋아하는 영화를 소개해 볼까요? 이 영화를 소개한 이유도 꼭 같이 이야기 해주세요!\n" +
                        "4. 모두 한 번씩 감상하셨으면 좋겠어요! 재미있게 시간을 보낼 수 있는 영화를 보면서 스트레스를 날릴 수 있고, 공감할 수 있는 영화를 본다면, 나의 감정을 이해할 수도 있을거예요! 마지막으로 오늘 상담이 어땠는지 서로 이야기해 봐요!\n" +
                        "5. 이제 인사하고 마무리할게요! 뜻깊은 시간이 되었기를 바라요. 오늘 함께 했던 분과 다음에도 상담하고 싶다면, 쪽지를 보내 약속을 잡아도 좋아요! 다음에 만날 때까지 행복한 하루 보내세요!"));
                break;
            case 독서 :
                gptCompletion.getMessages().add(0, new GptRequest("system", "번호를 이야기하면 여기에 정리해 놓은 번호에 대한 문장을 그대로 답변해 줘.\n" +
                        "1. 안녕하세요. 저는 여러분과 함께 시간을 보낼 귤귤이에요! 지금부터 함께 상담을 시작해 볼까요?\n" +
                        "2. 먼저, 우리 " + nickname + "님부터 이번 주 나의 감정이 어땠는지 되돌아봐요! 좋았던 기억, 힘들었던 일 등 어떤 주제도 좋으니 이야기해 주세요!\n" +
                        "3. 모두 한 주간 고생 많았어요! 대화를 통해 내가 어떤 생각을 했었는지를 알아보는 시간이 되었길 바라요. 이번에는 서로 감명 깊게 읽었던 책을 소개해 볼까요? 책 줄거리와, 느낀 점 위주로 이야기하면 좋을 것 같아요!\n" +
                        "4. 독서와 책 소개는 정서적, 사회적, 지적 측면에서 긍정적인 효과가 있다고 해요! 오늘 대화를 들어보니, 정말 그런 것 같아 신기하네요! 같은 책이더라도 다양한 해석이 나올 수 있다는 것도 너무 매력적이지 않나요? 오늘 소개받은 책을 읽어보기를 바랄게요! 마지막으로 오늘 상담이 어땠는지 서로 이야기해 봐요!\n" +
                        "5. 이제 인사하고 마무리할게요! 뜻깊은 시간이 되었기를 바라요. 오늘 함께 했던 분과 다음에도 상담하고 싶다면, 쪽지를 보내 약속을 잡아도 좋아요! 다음에 만날 때까지 행복한 하루 보내세요!"));
                break;
            case 대화 :
                gptCompletion.getMessages().add(0, new GptRequest("system", "번호를 이야기하면 여기에 정리해 놓은 번호에 대한 문장을 그대로 답변해 줘.\n" +
                        "1. 안녕하세요. 저는 여러분과 함께 시간을 보낼 귤귤이에요! 지금부터 함께 상담을 시작해 볼까요?\n" +
                        "2. 먼저, 우리 " + nickname + "님부터 이번 주 나의 감정이 어땠는지 되돌아봐요! 좋았던 기억, 힘들었던 일 등 어떤 주제도 좋으니 이야기해 주세요!\n" +
                        "3. 모두 한 주간 고생 많았어요! 대화를 통해 내가 어떤 생각을 했었는지를 알아보는 시간이 되었길 바라요. 이번에는 내가 평소에 하고 싶었던 말을 여기에 꺼내봐요. 하고 싶지만, 할 수 없었던 말, 참아왔던 말, 혹은 칭찬이나 공감받고 싶었던 이야기도 좋아요!\n" +
                        "4. 용기 내주어서 고마워요! 털어놓으니, 마음이 한결 가벼워지지 않았나요? 아니면, 마음이 따뜻해지지 않았나요? 나를 표현하는 건 정말 중요한 일이에요! 이렇게 조금씩 용기를 내며 연습하면 내 자존감도 올라갈거예요! 마지막으로 오늘 상담이 어땠는지 서로 이야기해 봐요!\n" +
                        "5. 이제 인사하고 마무리할게요! 뜻깊은 시간이 되었기를 바라요. 오늘 함께 했던 분과 다음에도 상담하고 싶다면, 쪽지를 보내 약속을 잡아도 좋아요! 다음에 만날 때까지 행복한 하루 보내세요!"));
                break;
        }

        System.out.println("param :: " + gptCompletion.toString());

        GptResponse gptResponse = GptService.prompt(gptCompletion);
        return ResponseEntity.status(200).body(gptResponse);
    }
}
