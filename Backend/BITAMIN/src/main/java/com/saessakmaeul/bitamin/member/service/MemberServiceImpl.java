package com.saessakmaeul.bitamin.member.service;

import com.saessakmaeul.bitamin.member.dto.request.*;
import com.saessakmaeul.bitamin.member.dto.response.AuthResponse;
import com.saessakmaeul.bitamin.member.dto.response.HealthReportResponseDTO;
import com.saessakmaeul.bitamin.member.dto.response.MemberResponseDTO;
import com.saessakmaeul.bitamin.member.entity.HealthReport;
import com.saessakmaeul.bitamin.member.entity.Member;
import com.saessakmaeul.bitamin.member.entity.RefreshToken;
import com.saessakmaeul.bitamin.member.repository.HealthReportRepository;
import com.saessakmaeul.bitamin.member.repository.MemberRepository;
import com.saessakmaeul.bitamin.member.repository.RefreshTokenRepository;
import com.saessakmaeul.bitamin.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class MemberServiceImpl implements MemberService {
    private final MemberRepository memberRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final HealthReportRepository healthReportRepository;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
//    private S3Service s3Service;

    public MemberServiceImpl(MemberRepository memberRepository, RefreshTokenRepository refreshTokenRepository, @Lazy PasswordEncoder passwordEncoder, HealthReportRepository healthReportRepository) {
        this.memberRepository = memberRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.healthReportRepository = healthReportRepository;
    }

    @Override
    @Transactional
    public Long register(MemberResponseDTO memberDTO) throws IOException {
        Member member = Member.builder()
                .email(memberDTO.getEmail())
                .password(passwordEncoder.encode(memberDTO.getPassword()))
                .name(memberDTO.getName())
                .nickname(memberDTO.getNickname())
                .dongCode(memberDTO.getDongCode())
                .birthday(memberDTO.getBirthday())
                .role(memberDTO.getRole())
                .build();
        member = memberRepository.save(member);
        if (memberDTO.getProfileImage() != null && !memberDTO.getProfileImage().isEmpty()) {
            String fileName = UUID.randomUUID() + "_" + memberDTO.getProfileImage().getOriginalFilename();

            member.setProfileKey(fileName);
        }
        memberRepository.save(member);
        return member.getId();
        // 1차 저장 후 2차 저장
    }

    @Override
    public Optional<Member> getMember(String email) {
        return memberRepository.findByEmail(email);
    }

    @Override
    public List<MemberResponseDTO> getMemberList() {
        return memberRepository.findAll().stream()
                .map(member -> MemberResponseDTO.builder()
                        .id(member.getId())
                        .name(member.getName())
                        .email(member.getEmail())
                        .nickname(member.getNickname())
                        .password(member.getPassword())
                        .birthday(member.getBirthday())
                        .dongCode(member.getDongCode())
                        .profileKey(member.getProfileKey())
                        .profileUrl(member.getProfileUrl())
                        .role(member.getRole())
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    public boolean changePassword(Long userId, ChangePasswordRequest changePasswordRequest) {
        Optional<Member> optionalMember = memberRepository.findById(userId);
        if (optionalMember.isPresent()) {
            Member member = optionalMember.get();
            if (passwordEncoder.matches(changePasswordRequest.getCurrentPassword(), member.getPassword())) {
                member.setPassword(passwordEncoder.encode(changePasswordRequest.getNewPassword()));
                memberRepository.save(member);
                return true;
            }
        }
        return false;
    }

    @Override
    public boolean checkPassword(String email, String password) {
        Member member = getMember(email).orElseThrow(() -> new RuntimeException("User not found"));
        return passwordEncoder.matches(password, member.getPassword());
    }

    @Override
    @Transactional
    public void deleteMember(Long memberId) {
        // 연결된 모든 테이블 데이터 삭제
        // 회원 id랑 연결된 모든 테이블의 repository를 넣어야함.deleteByMemberId(memberId);
        refreshTokenRepository.deleteByUserId(memberId);
        healthReportRepository.findByMemberId(memberId);

        // 최최종 Member 테이블에서 삭제
        memberRepository.deleteById(memberId);
    }

    @Override
    public MemberRequestDTO getMemberById(Long userId) {
        Optional<Member> optionalMember = memberRepository.findById(userId);
        if (optionalMember.isPresent()) {
            Member member = optionalMember.get();
            return MemberRequestDTO.builder()
                    .email(member.getEmail())
                    .password(member.getPassword())
                    .name(member.getName())
                    .nickname(member.getNickname())
                    .dongCode(member.getDongCode())
                    .birthday(member.getBirthday())
                    .profileKey(member.getProfileKey())
                    .profileUrl(member.getProfileUrl())
                    .build();
        } else {
            return null;
        }
    }

    @Override
    @Transactional
    public int updateMember(Long userId, MemberUpdateRequestDTO memberUpdateRequestDTO) throws IOException {
        Optional<Member> optionalMember = memberRepository.findById(userId);
        if (optionalMember.isPresent()) {
            Member member = optionalMember.get();
            member.setName(memberUpdateRequestDTO.getName());
            member.setNickname(memberUpdateRequestDTO.getNickname());
            member.setDongCode(memberUpdateRequestDTO.getDongCode());
            member.setBirthday(memberUpdateRequestDTO.getBirthday());
            if (memberUpdateRequestDTO.getProfileImage() != null && !memberUpdateRequestDTO.getProfileImage().isEmpty()) {
                String fileName = UUID.randomUUID() + "_" + memberUpdateRequestDTO.getProfileImage().getOriginalFilename();

                member.setProfileKey(fileName);
            }
            memberRepository.save(member);
            return 1;
        } else {
            return 0;
        }
    }



    @Override
    public AuthResponse login(LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
            );
            SecurityContextHolder.getContext().setAuthentication(authentication);

            Member user = memberRepository.findByEmail(loginRequest.getEmail())
                    .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

            String jwt = jwtUtil.generateAccessToken(user);
            String refreshToken = jwtUtil.generateRefreshToken(user);

            Optional<RefreshToken> existingToken = refreshTokenRepository.findById(user.getId());
            RefreshToken token;
            if (existingToken.isPresent()) {
                token = existingToken.get();
                token.setToken(refreshToken);
                token.setExpireDate(new Date(System.currentTimeMillis() + jwtUtil.getRefreshTokenExpiration()));
            } else {
                token = new RefreshToken();
                token.setToken(refreshToken);
                token.setExpireDate(new Date(System.currentTimeMillis() + jwtUtil.getRefreshTokenExpiration()));
                token.setUser(user);
            }
            refreshTokenRepository.save(token);

            return new AuthResponse(jwt, refreshToken, true);
        } catch (Exception e) {
            throw new RuntimeException("로그인 실패: " + e.getMessage());
        }
    }

    @Override
    public AuthResponse refreshToken(String cookieRefreshToken) {
        try {
            if (jwtUtil.isTokenExpired(cookieRefreshToken)) {
                throw new RuntimeException("Refresh Token이 만료되었습니다.");
            }
            Long userId = jwtUtil.extractUserId(cookieRefreshToken);
            Optional<RefreshToken> refreshToken = refreshTokenRepository.findByUserId(userId);
            if (refreshToken.isPresent() && refreshToken.get().getToken().equals(cookieRefreshToken)) {
                String newAccessToken = jwtUtil.generateAccessToken(memberRepository.findById(userId)
                        .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다.")));
                return new AuthResponse(newAccessToken, cookieRefreshToken, true);
            } else {
                throw new RuntimeException("유효한 Refresh Token이 없습니다.");
            }
        } catch (Exception e) {
            throw new RuntimeException("AccessToken 재생성 실패: " + e.getMessage());
        }
    }

    @Override
    public void logout(String email) {
        SecurityContextHolder.clearContext();
    }

    @Override
    public String getUserRole(String token) {
        try {
            return jwtUtil.extractRole(token);
        } catch (Exception e) {
            throw new RuntimeException("회원 권한 조회 실패: " + e.getMessage());
        }
    }



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