package com.saessakmaeul.bitamin.mission.service;

import com.saessakmaeul.bitamin.mission.dto.response.MissionResponse;
import com.saessakmaeul.bitamin.mission.entity.MemberMission;
import com.saessakmaeul.bitamin.mission.entity.Mission;
import com.saessakmaeul.bitamin.mission.repository.MemberMissionRepository;
import com.saessakmaeul.bitamin.mission.repository.MissionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.Random;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MissionService {

    private final MissionRepository missionRepository;
    private final MemberMissionRepository memberMissionRepository;

    // 데일리 미션 조회
    public MissionResponse readMission(Long memberId) {
        // 유저가 가장 최근에 한 미션 ID 조회
        Optional<MemberMission> recentMissionOpt = memberMissionRepository.findFirstByUserIdOrderByCompleteDateDesc(memberId);
        Long recentMissionId = recentMissionOpt.map(MemberMission::getMissionId).orElse(null);

        // 모든 미션 조회
        List<Mission> missions = missionRepository.findAll();

        // 모든 미션 -> 최근 미션을 제외한 리스트 생성
        List<Mission> filteredMissions;
        if(recentMissionId != null){ // 이전 미션이 있는 경우
            filteredMissions = missions.stream()
                    .filter(mission -> mission.getId() != recentMissionId)
                    .toList();
        } else{ // 이전 미션이 없는 뉴비인 경우
            filteredMissions = missions;
        }

        // 무작위 미션 선택
        Random random = new Random();
        Mission randomMission = filteredMissions.get(random.nextInt(filteredMissions.size()));

        // MissionResponse로 반환
        return MissionResponse.builder()
                .id(randomMission.getId())
                .missionName(randomMission.getMissionName())
                .missionDescription(randomMission.getMissionDescription())
                .missionLevel(randomMission.getMissionLevel())
                .build();
    }

    // 미션 교체
    public MissionResponse changeMission(Long missionId) {
        // 모든 미션 조회
        List<Mission> missions = missionRepository.findAll();

        // 모든 미션 -> 현재 미션을 제외한 미션 리스트 생성
        List<Mission> filteredMissions;
        filteredMissions = missions.stream()
                .filter(mission -> mission.getId() != missionId)
                .toList();

        System.out.println(filteredMissions);

        // 무작위 미션 선택
        Random random = new Random();
        Mission randomMission = filteredMissions.get(random.nextInt(filteredMissions.size()));

        // MissionResponse로 반환
        return MissionResponse.builder()
                .id(randomMission.getId())
                .missionName(randomMission.getMissionName())
                .missionDescription(randomMission.getMissionDescription())
                .missionLevel(randomMission.getMissionLevel())
                .build();
    }


    public MissionResponse completedMission(Long memberId, String date) {
        // 유저가 미션 수행한 날짜 형변환
        LocalDate completeDate = LocalDate.parse(date, DateTimeFormatter.ISO_DATE);

        // 유저가 해당 날짜에 한 미션 ID 조회
        Optional<MemberMission> memberMissionOpt = memberMissionRepository.findByUserIdAndCompleteDate(memberId, completeDate);
        Long completedMissionId = memberMissionOpt.map(MemberMission::getMissionId).orElse(null);

        // 미션 ID가 null인 경우 null 반환
        if (completedMissionId == null) {
            return null;
        }

        // 미션 ID를 통해서 해당 미션 찾기
        Optional<Mission> completedMissionOpt = missionRepository.findById(completedMissionId);
        Mission completedMission = completedMissionOpt.orElseThrow(() -> new RuntimeException("해당 미션이 없습니다."));

        // Mission이 없는 경우 null 반환
        if (completedMission == null) {
            return null;
        }

        // MissionResponse로 반환
        return MissionResponse.builder()
                .id(completedMission.getId())
                .missionName(completedMission.getMissionName())
                .missionDescription(completedMission.getMissionDescription())
                .missionLevel(completedMission.getMissionLevel())
                .build();
    }
}
