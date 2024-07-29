package com.saessakmaeul.bitamin.consultations.controller;

import com.saessakmaeul.bitamin.consultations.Entity.SearchCondition;
import com.saessakmaeul.bitamin.consultations.dto.request.*;
import com.saessakmaeul.bitamin.consultations.dto.response.*;
import com.saessakmaeul.bitamin.consultations.service.ConsultationService;
import com.saessakmaeul.bitamin.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/consultations")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
public class ConsultationController {
    private final ConsultationService consultationService;
    private final JwtUtil jwtUtil;

    @GetMapping
    public ResponseEntity<?> selectAll(@RequestParam(value = "page", defaultValue = "0") int page,
                                       @RequestParam(value = "size", defaultValue = "100") int size,
                                       @RequestParam(value = "type") SearchCondition type) {

        List<SelectAllResponse> consultationList = consultationService.selectAll(page, size, type);

        if(consultationList == null) return ResponseEntity.status(404).body("다시 조회하세요");

        return ResponseEntity.ok(consultationList);
    }

    @PostMapping
    public ResponseEntity<?> registRoom(@RequestHeader(value = "Authorization", required = false) String tokenHeader,
                                        @RequestBody RegistRoomRequest registRoomRequest) {

        Long memberId = jwtUtil.extractUserId(tokenHeader.substring(7));
        String memberNickname = jwtUtil.extractNickname(tokenHeader.substring(7));
        registRoomRequest.setMemberId(memberId);
        registRoomRequest.setMemberNickname(memberNickname);

        RegistRoomResponse registRoomResponse = consultationService.registRoom(registRoomRequest);

        if(registRoomResponse == null) return ResponseEntity.status(404).body("방이 생성되지 않았습니다.");

        return ResponseEntity.status(201).body(registRoomResponse);

    }

    @PostMapping("/participants")
    public ResponseEntity<?> joinRoom(@RequestHeader(value = "Authorization", required = false) String tokenHeader,
                                      @RequestBody JoinRoomRequest joinRoomRequest) {

        Long memberId = jwtUtil.extractUserId(tokenHeader.substring(7));
        String memberNickname = jwtUtil.extractNickname(tokenHeader.substring(7));

        joinRoomRequest.setConsultationId(joinRoomRequest.getId());
        joinRoomRequest.setMemberId(memberId);
        joinRoomRequest.setMemberNickname(memberNickname);
        joinRoomRequest.setConsultationDate(joinRoomRequest.getStartTime().toLocalDate());

        JoinRoomResponse joinRoomResponse = consultationService.joinRoom(joinRoomRequest);

        if(joinRoomResponse == null) return ResponseEntity.status(404).body("방에 참여되지 않았습니다.");

        return ResponseEntity.status(200).body(joinRoomResponse);
    }

    @PostMapping("/random-participants")
    public ResponseEntity<?> joinRandom(@RequestHeader(value = "Authorization", required = false) String tokenHeader,
                                        @RequestBody JoinRandomRequest joinRandomRequest) {

        Long memberId = jwtUtil.extractUserId(tokenHeader.substring(7));
        String memberNickname = jwtUtil.extractNickname(tokenHeader.substring(7));

        joinRandomRequest.setMemberId(memberId);
        joinRandomRequest.setMemberNickname(memberNickname);

        JoinRandomResponse joinRandomResponse = consultationService.joinRandom(joinRandomRequest);

        if(joinRandomResponse == null) return ResponseEntity.status(404).body("방에 참여되지 않았습니다.");

        return ResponseEntity.status(200).body(joinRandomResponse);
    }

    @DeleteMapping("{consultationId}")
    public ResponseEntity<?> ExitRoomBeforeStart(@RequestHeader(value = "Authorization", required = false) String tokenHeader,
                                                 @PathVariable("consultationId") Long consultationId) {

        Long memberId = jwtUtil.extractUserId(tokenHeader.substring(7));

        ExitRoomBeforeStartRequest exitRoomBeforeStartRequest = new ExitRoomBeforeStartRequest(memberId, consultationId);
        exitRoomBeforeStartRequest.setMemberId(memberId);

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
}
