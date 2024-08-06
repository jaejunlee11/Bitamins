package com.saessakmaeul.bitamin.mission.controller;

import com.saessakmaeul.bitamin.mission.dto.response.MissionResponse;
import com.saessakmaeul.bitamin.mission.service.MissionService;
import com.saessakmaeul.bitamin.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/missions")
@RequiredArgsConstructor
public class MissionController {

    private final MissionService missionService;
    private final JwtUtil jwtUtil;

    // 데일리 미션 조회
    @GetMapping
    public MissionResponse getMission(@RequestHeader(value = "Authorization", required = false) String tokenHeader){
        // ID 추출
        Long memberId = jwtUtil.extractUserId(tokenHeader.substring(7));

        // Service 호출
        MissionResponse missionResponse = missionService.readMission(memberId);
        return missionResponse;
    }

    // 미션 교체
    @GetMapping("/substitute")
    public MissionResponse getMissionSubstitute(@RequestParam("missionId") Long missionId){
        // Service 호출
        MissionResponse missionResponse = missionService.changeMission(missionId);
        return missionResponse;

    }
}
