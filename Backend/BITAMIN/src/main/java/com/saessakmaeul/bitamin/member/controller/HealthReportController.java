package com.saessakmaeul.bitamin.member.controller;

import com.saessakmaeul.bitamin.member.dto.request.HealthReportRequestDTO;
import com.saessakmaeul.bitamin.member.dto.response.HealthReportResponseDTO;
import com.saessakmaeul.bitamin.member.service.HealthReportService;
import com.saessakmaeul.bitamin.util.JwtUtil;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/health-report")
public class HealthReportController {

    @Autowired
    private HealthReportService healthReportService;

    @Autowired
    private JwtUtil jwtUtil;

    @Operation(summary = "자가진단 결과 기록", description = "")
    @PostMapping
    public ResponseEntity<HealthReportResponseDTO> createHealthReport(@RequestBody HealthReportRequestDTO healthReportRequestDTO, HttpServletRequest request) {
        String authorizationHeader = request.getHeader("Authorization");
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).build(); // 인증 실패 시 401 응답
        }

        String token = authorizationHeader.substring(7);
        Long userId = jwtUtil.extractUserId(token);

        HealthReportResponseDTO healthReportResponseDTO = healthReportService.saveHealthReport(healthReportRequestDTO, userId);
        return ResponseEntity.ok(healthReportResponseDTO);
    }

    @Operation(summary = "자가진단 결과 리스트 조회", description = "")
    @GetMapping
    public ResponseEntity<List<HealthReportResponseDTO>> getHealthReports(HttpServletRequest request) {
        String authorizationHeader = request.getHeader("Authorization");
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).build();
        }

        String token = authorizationHeader.substring(7);
        Long userId = jwtUtil.extractUserId(token);

        List<HealthReportResponseDTO> healthReports = healthReportService.getHealthReportsByUserId(userId);
        return ResponseEntity.ok(healthReports);
    }
}
