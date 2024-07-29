package com.saessakmaeul.bitamin.member.service;

import com.saessakmaeul.bitamin.member.dto.request.HealthReportRequestDTO;
import com.saessakmaeul.bitamin.member.dto.response.HealthReportResponseDTO;
import com.saessakmaeul.bitamin.member.entity.HealthReport;
import com.saessakmaeul.bitamin.member.entity.Member;
import com.saessakmaeul.bitamin.member.repository.HealthReportRepository;
import com.saessakmaeul.bitamin.member.repository.MemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class HealthReportServiceImpl implements HealthReportService {

    @Autowired
    private HealthReportRepository healthReportRepository;

    @Autowired
    private MemberRepository memberRepository;

    @Override
    public HealthReportResponseDTO saveHealthReport(HealthReportRequestDTO healthReportRequestDTO, Long userId) {
        HealthReport healthReport = new HealthReport();
        healthReport.setCheckupScore(healthReportRequestDTO.getCheckupScore());
        healthReport.setCheckupDate(healthReportRequestDTO.getCheckupDate());

        Member member = memberRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid member ID"));
        healthReport.setMember(member);

        HealthReport savedHealthReport = healthReportRepository.save(healthReport);

        HealthReportResponseDTO healthReportResponseDTO = new HealthReportResponseDTO();
        healthReportResponseDTO.setId(savedHealthReport.getId());
        healthReportResponseDTO.setCheckupScore(savedHealthReport.getCheckupScore());
        healthReportResponseDTO.setCheckupDate(savedHealthReport.getCheckupDate());
        healthReportResponseDTO.setMemberId(savedHealthReport.getMember().getId());

        return healthReportResponseDTO;
    }

    @Override
    public List<HealthReportResponseDTO> getHealthReportsByUserId(Long userId) {
        List<HealthReport> healthReports = healthReportRepository.findByMemberId(userId);
        return healthReports.stream().map(healthReport -> {
            HealthReportResponseDTO dto = new HealthReportResponseDTO();
            dto.setId(healthReport.getId());
            dto.setCheckupScore(healthReport.getCheckupScore());
            dto.setCheckupDate(healthReport.getCheckupDate());
            dto.setMemberId(healthReport.getMember().getId());
            return dto;
        }).collect(Collectors.toList());
    }
}
