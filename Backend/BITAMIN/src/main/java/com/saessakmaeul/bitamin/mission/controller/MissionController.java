package com.saessakmaeul.bitamin.mission.controller;

import com.saessakmaeul.bitamin.mission.dto.request.MemberMissionRequest;
import com.saessakmaeul.bitamin.mission.dto.response.CompletedMemberMissionResponse;
import com.saessakmaeul.bitamin.mission.dto.response.MemberExperienceResponse;
import com.saessakmaeul.bitamin.mission.dto.response.MemberMissionResponse;
import com.saessakmaeul.bitamin.mission.dto.response.MissionResponse;
import com.saessakmaeul.bitamin.mission.service.ExperienceService;
import com.saessakmaeul.bitamin.mission.service.MissionService;
import com.saessakmaeul.bitamin.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/missions")
@RequiredArgsConstructor
public class MissionController {

    private final MissionService missionService;
    private final ExperienceService experienceService;
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

    // 완료한 미션 조회 기능
    @GetMapping("/completed")
    public CompletedMemberMissionResponse getMissionCompleted(@RequestHeader(value = "Authorization", required = false) String tokenHeader
                                               , @RequestParam("date") String date){
        // ID 추출
        Long memberId = jwtUtil.extractUserId(tokenHeader.substring(7));

        // Service 호출
        CompletedMemberMissionResponse completedMemberMissionResponse = missionService.completedMission(memberId, date);
        return completedMemberMissionResponse;
    }

    // 미션 리뷰 등록 기능
    @PostMapping
    public MemberMissionResponse postMission(@RequestHeader(value = "Authorization", required = false) String tokenHeader,
                                             @RequestPart("memberMissionRequest") MemberMissionRequest memberMissionRequest,
                                             @RequestPart("mssionImage") MultipartFile missionImage) throws IOException {
        // ID 추출
        Long memberId = jwtUtil.extractUserId(tokenHeader.substring(7));

        // MemberMissionRequest에 missionImage 설정
        memberMissionRequest.setMissionImage(missionImage);

        // Service 호출
        MemberMissionResponse memberMissionResponse = missionService.createMemberMission(memberId, memberMissionRequest);
        return memberMissionResponse;
    }

    // 반려 식물 경험치 조회 기능
    @GetMapping("/plant")
    public MemberExperienceResponse getExperience(@RequestHeader(value = "Authorization", required = false) String tokenHeader){
        // ID 추출
        Long memberId = jwtUtil.extractUserId(tokenHeader.substring(7));

        // Service 호출
        MemberExperienceResponse memberExperienceResponse = experienceService.readExperience(memberId);
        return memberExperienceResponse;
    }

}
