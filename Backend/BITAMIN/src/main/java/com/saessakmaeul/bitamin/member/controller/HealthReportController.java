package com.saessakmaeul.bitamin.member.controller;

import com.saessakmaeul.bitamin.member.dto.request.HealthReportRequestDTO;
import com.saessakmaeul.bitamin.member.dto.response.HealthReportResponseDTO;
import com.saessakmaeul.bitamin.member.service.HealthReportService;
import com.saessakmaeul.bitamin.util.JwtUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/health-report")
@CrossOrigin(origins = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
@Tag(name = "HealthReport Controller", description = "회원 자가 검진 기록 관리하는 컨트롤러")
public class HealthReportController {

    @Autowired
    private HealthReportService healthReportService;

    @Autowired
    private JwtUtil jwtUtil;

    @Operation(summary = "자가진단 결과 기록", description = "")
    @PostMapping
    public ResponseEntity<HealthReportResponseDTO> createHealthReport(@RequestBody HealthReportRequestDTO healthReportRequestDTO, HttpServletRequest request) {
        try {
            String token = getTokenFromRequest(request);
            if (token == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
            Long userId = jwtUtil.extractUserId(token);
            HealthReportResponseDTO healthReportResponseDTO = healthReportService.saveHealthReport(healthReportRequestDTO, userId);
            return ResponseEntity.ok(healthReportResponseDTO);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @Operation(summary = "자가진단 결과 리스트 조회", description = "")
    @GetMapping
    public ResponseEntity<List<HealthReportResponseDTO>> getHealthReports(HttpServletRequest request) {
        try {
            String token = getTokenFromRequest(request);
            if (token == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
            Long userId = jwtUtil.extractUserId(token);
            List<HealthReportResponseDTO> healthReports = healthReportService.getHealthReportsByUserId(userId);
            return ResponseEntity.ok(healthReports);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @Operation(summary = "JWT 토큰 추출 메서드", description = "JWT 토큰을 추출하는 메서드")
    private String getTokenFromRequest(HttpServletRequest request) {
        String authorizationHeader = request.getHeader("Authorization");
        return authorizationHeader != null && authorizationHeader.startsWith("Bearer ") ? authorizationHeader.substring(7) : null;
    }
}
