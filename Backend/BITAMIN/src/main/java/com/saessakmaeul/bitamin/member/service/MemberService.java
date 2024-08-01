package com.saessakmaeul.bitamin.member.service;

import com.saessakmaeul.bitamin.member.dto.request.ChangePasswordRequest;
import com.saessakmaeul.bitamin.member.dto.request.LoginRequest;
import com.saessakmaeul.bitamin.member.dto.request.MemberRequestDTO;
import com.saessakmaeul.bitamin.member.dto.request.MemberUpdateRequestDTO;
import com.saessakmaeul.bitamin.member.dto.response.AuthResponse;
import com.saessakmaeul.bitamin.member.dto.response.MemberResponseDTO;
import com.saessakmaeul.bitamin.member.entity.Member;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

public interface MemberService {
    Long register(MemberResponseDTO memberDTO) throws IOException;
    Optional<Member> getMember(String email);
    List<MemberResponseDTO> getMemberList();
    boolean changePassword(Long userId, ChangePasswordRequest changePasswordRequest);
    boolean checkPassword(String email, String password);
    void deleteMember(Long memberId);
    MemberRequestDTO getMemberById(Long userId);
    int updateMember(Long userId, MemberUpdateRequestDTO memberUpdateRequestDTO) throws IOException;
    AuthResponse login(LoginRequest loginRequest);
    AuthResponse refreshToken(String refreshToken);
    void logout(String email);
    String getUserRole(String token);
}
