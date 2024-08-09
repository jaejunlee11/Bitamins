package com.saessakmaeul.bitamin.mission.service;


import com.saessakmaeul.bitamin.mission.dto.response.MemberExperienceResponse;
import com.saessakmaeul.bitamin.mission.entity.UserExperience;
import com.saessakmaeul.bitamin.mission.repository.MemberExperienceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ExperienceService {

    private final MemberExperienceRepository memberExperienceRepository;

    public MemberExperienceResponse readExperience(Long memberId) {
        // memberId로 경험치 조회
        Optional<UserExperience> memberExperienceOpt = memberExperienceRepository.findById(memberId);
        UserExperience memberExperience = memberExperienceOpt.orElse(null);

        return MemberExperienceResponse.builder()
                .id(memberExperience.getId())
                .experience(memberExperience.getExperience())
                .build();

    }
}
