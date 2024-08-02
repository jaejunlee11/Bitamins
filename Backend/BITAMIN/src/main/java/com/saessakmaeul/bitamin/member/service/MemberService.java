package com.saessakmaeul.bitamin.member.service;

import com.saessakmaeul.bitamin.member.dto.request.*;
import com.saessakmaeul.bitamin.member.dto.response.AuthResponse;
import com.saessakmaeul.bitamin.member.dto.response.HealthReportResponseDTO;
import com.saessakmaeul.bitamin.member.dto.response.MemberResponseDTO;
import com.saessakmaeul.bitamin.member.entity.Member;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

public interface MemberService {
    Long register(MemberRequestDTO memberDTO) throws IOException;
    Optional<Member> getMember(String email);
    List<MemberResponseDTO> getMemberList();
    boolean changePassword(Long userId, ChangePasswordRequest changePasswordRequest);
    boolean checkPassword(String email, String password);
    void deleteMember(Long userId);
    MemberResponseDTO getMemberById(Long userId);
    int updateMember(Long userId, MemberUpdateRequestDTO memberUpdateRequestDTO) throws IOException;
    AuthResponse login(LoginRequest loginRequest);
    AuthResponse refreshToken(String refreshToken);
    void logout(Long userId);
    String getUserRole(String token);
    HealthReportResponseDTO saveHealthReport(HealthReportRequestDTO healthReportRequestDTO, Long userId);
    List<HealthReportResponseDTO> getHealthReportsByUserId(Long userId);
}
