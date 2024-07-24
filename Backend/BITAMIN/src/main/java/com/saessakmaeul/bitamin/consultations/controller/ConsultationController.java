package com.saessakmaeul.bitamin.consultations.controller;

import com.saessakmaeul.bitamin.consultations.Entity.SearchCondition;
import com.saessakmaeul.bitamin.consultations.dto.request.JoinRandomRequest;
import com.saessakmaeul.bitamin.consultations.dto.request.JoinRoomRequest;
import com.saessakmaeul.bitamin.consultations.dto.request.RegistRoomRequest;
import com.saessakmaeul.bitamin.consultations.dto.response.JoinRandomResponse;
import com.saessakmaeul.bitamin.consultations.dto.response.JoinRoomResponse;
import com.saessakmaeul.bitamin.consultations.dto.response.RegistRoomResponse;
import com.saessakmaeul.bitamin.consultations.dto.response.SelectAllResponse;
import com.saessakmaeul.bitamin.consultations.service.ConsultationService;
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

    @GetMapping
    public ResponseEntity<?> selectAll(
//            @RequestHeader(value = "Authorization", required = false) String tokenHeader,
                                       @RequestParam(value = "page", defaultValue = "0") int page,
                                       @RequestParam(value = "size", defaultValue = "100") int size,
                                       @RequestParam(value = "type") SearchCondition type) {

        System.out.println("Controller");

        List<SelectAllResponse> consultations = consultationService.selectAll(page, size, type);

        return ResponseEntity.ok(consultations);
    }

    @PostMapping
    public ResponseEntity<?> registRoom(
//            @RequestHeader(value = "Authorization", required = false) String tokenHeader,
            @RequestBody RegistRoomRequest registRoomRequest) {

        // 기본 생성까진 확인 완료
//        String memberId = jwtUtil.getIdFromToken(tokenHeader.substring(7));
//        String memberNickname = jwtUtil.getNicknameFromToken(tokenHeader.substring(7));
//        registRoomRequest.setMemberId(memberId);
//        registRoomRequest.setMemberNickname(memberNickName);

        RegistRoomResponse registRoomResponse = consultationService.registRoom(registRoomRequest);

        if(registRoomResponse == null) return ResponseEntity.status(404).body("방이 생성되지 않았습니다.");

        return ResponseEntity.status(201).body(registRoomRequest);

    }

    @PostMapping("/participants")
    public ResponseEntity<?> joinRoom(
//            @RequestHeader(value = "Authorization", required = false) String tokenHeader,
            @RequestBody JoinRoomRequest joinRoomRequest) {

//        String memberId = jwtUtil.getIdFromToken(tokenHeader.substring(7));
//        String memberNickname = jwtUtil.getNicknameFromToken(tokenHeader.substring(7));

//        joinRoomRequest.setConsultationId(joinRoomRequest.getId());
//        joinRoomRequest.setMemberId(memberId);
//        joinRoomRequest.setMemberNickname(memberNickName);
//        joinRoomRequest.setConsultationDate(joinRoomRequest.getStartTime().toLocalDate());

        JoinRoomResponse joinRoomResponse = consultationService.joinRoom(joinRoomRequest);

        if(joinRoomResponse == null) return ResponseEntity.status(404).body("방에 참여되지 않았습니다.");

        return ResponseEntity.status(200).body(joinRoomResponse);
    }

    @PostMapping("/random-participants")
    public ResponseEntity<?> joinRandom(
//            @RequestHeader(value = "Authorization", required = false) String tokenHeader,
            @RequestBody JoinRandomRequest joinRandomRequest) {
//        String memberId = jwtUtil.getIdFromToken(tokenHeader.substring(7));
//        String memberNickname = jwtUtil.getNicknameFromToken(tokenHeader.substring(7));

//        joinRoomRequest.setMemberId(memberId);
//        joinRoomRequest.setMemberNickname(memberNickName);

        JoinRandomResponse joinRandomResponse = consultationService.joinRandom(joinRandomRequest);

        if(joinRandomResponse == null) return ResponseEntity.status(404).body("방에 참여되지 않았습니다.");

        return ResponseEntity.status(200).body(joinRandomResponse);
    }
}
