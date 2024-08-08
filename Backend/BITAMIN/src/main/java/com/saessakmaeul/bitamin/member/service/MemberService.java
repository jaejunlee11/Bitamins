package com.saessakmaeul.bitamin.member.service;

import com.saessakmaeul.bitamin.exception.ApplicationException;
import com.saessakmaeul.bitamin.member.dto.request.*;
import com.saessakmaeul.bitamin.member.dto.request.HealthReportRequestDTO;
import com.saessakmaeul.bitamin.member.dto.response.*;
import com.saessakmaeul.bitamin.member.entity.*;
import com.saessakmaeul.bitamin.member.repository.DongCodeRepository;
import com.saessakmaeul.bitamin.member.repository.HealthReportRepository;
import com.saessakmaeul.bitamin.member.repository.MemberRepository;
import com.saessakmaeul.bitamin.member.repository.RefreshTokenRepository;
import com.saessakmaeul.bitamin.service.S3Service;
import com.saessakmaeul.bitamin.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MemberService {
    private final MemberRepository memberRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final HealthReportRepository healthReportRepository;
    private final DongCodeRepository dongCodeRepository;
    private final S3Service s3Service;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    @Transactional
    public Long register(MemberRequestDTO memberDTO, MultipartFile image) throws IOException {
        try {
            String dongCode = findDongCode(memberDTO.getSidoName(), memberDTO.getGugunName(), memberDTO.getDongName());
            Member member = Member.builder()
                    .email(memberDTO.getEmail())
                    .password(passwordEncoder.encode(memberDTO.getPassword()))
                    .name(memberDTO.getName())
                    .nickname(memberDTO.getNickname())
                    .dongCode(dongCode)
                    .birthday(memberDTO.getBirthday())
                    .role(Role.ROLE_MEMBER)
                    .build();

            if (image != null && !image.isEmpty()) {
                String fileUrl = s3Service.uploadFile(image);
                member.setProfileUrl(fileUrl);
            }

            member = memberRepository.save(member);

            return member.getId();
        } catch (IOException e) {
            throw new IOException(e);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("잘못된 입력 값 : " + e, e);
        } catch (Exception e) {
            throw new RuntimeException("입력 정보 부족 : " + e, e);
        }
    }


    public String findDongCode(String sidoName, String gugunName, String dongName) {
        return dongCodeRepository.findDongCode(sidoName, gugunName, dongName)
                .orElseThrow(() -> new IllegalArgumentException("해당 주소에 대한 동 코드를 찾을 수 없습니다."));
    }

    public List<MemberListResponseDTO> getMemberList() {
        return memberRepository.findAll().stream()
                .map(member -> MemberListResponseDTO.builder()
                        .id(member.getId())
                        .name(member.getName())
                        .email(member.getEmail())
                        .nickname(member.getNickname())
                        .password(member.getPassword())
                        .birthday(member.getBirthday())
                        .dongCode(member.getDongCode())
                        .profileUrl(member.getProfileUrl())
                        .role(member.getRole())
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional
    public boolean changePassword(Long userId, ChangePasswordRequest changePasswordRequest) {
        try {
            Optional<Member> optionalMember = memberRepository.findById(userId);
            if (optionalMember.isPresent()) {
                Member member = optionalMember.get();
                if (passwordEncoder.matches(changePasswordRequest.getCurrentPassword(), member.getPassword())) {
                    member.setPassword(passwordEncoder.encode(changePasswordRequest.getNewPassword()));
                    memberRepository.save(member);
                    return true;
                } else {
                    throw new IllegalArgumentException("현재 비밀번호가 일치하지 않습니다.");
                }
            } else {
                throw new NoSuchElementException("사용자를 찾을 수 없습니다.");
            }
        } catch (IllegalArgumentException | NoSuchElementException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("비밀번호 변경 중 오류 발생", e);
        }
    }


    @Transactional
    public boolean checkPassword(Long userId, String password) {
        try {
            Optional<Member> optionalMember = memberRepository.findById(userId);
            if (optionalMember.isPresent()) {
                Member member = optionalMember.get();
                if (passwordEncoder.matches(password, member.getPassword())) {
                    return true;
                } else {
                    throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
                }
            } else {
                throw new IllegalArgumentException("회원을 찾을 수 없습니다.");
            }
        } catch (IllegalArgumentException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }


    @Transactional
    public void deleteMember(Long memberId) {
        try {
            if (!memberRepository.existsById(memberId)) {
                throw new IllegalArgumentException("회원 정보를 찾을 수 없습니다.");
            }
            refreshTokenRepository.deleteByUserId(memberId);
            healthReportRepository.deleteById(memberId);
            memberRepository.deleteById(memberId);
        } catch (IllegalArgumentException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }


    public MemberResponseDTO getMemberById(Long userId) {
        try {
            Optional<Member> optionalMember = memberRepository.findById(userId);
            if (optionalMember.isPresent()) {
                Member member = optionalMember.get();
                Optional<DongCodeResponseDTO> dongInformationOptional = dongCodeRepository.findNamesByDongCode(member.getDongCode());
                if (dongInformationOptional.isPresent()) {
                    DongCodeResponseDTO dongInformation = dongInformationOptional.get();
                    return MemberResponseDTO.builder()
                            .email(member.getEmail())
                            .password(member.getPassword())
                            .name(member.getName())
                            .nickname(member.getNickname())
                            .sidoName(dongInformation.getSidoName())
                            .gugunName(dongInformation.getGugunName())
                            .dongName(dongInformation.getDongName())
                            .xCoordinate(dongInformation.getXCoordinate())
                            .yCoordinate(dongInformation.getYCoordinate())
                            .lat(dongInformation.getLat())
                            .lng(dongInformation.getLng())
                            .birthday(member.getBirthday())
                            .profileUrl(member.getProfileUrl())
                            .build();
                } else {
                    throw new IllegalArgumentException("해당 동코드에 대한 정보를 찾을 수 없습니다.");
                }
            } else {
                throw new IllegalArgumentException("회원을 찾을 수 없습니다.");
            }
        } catch (IllegalArgumentException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }


    @Transactional
    public int updateMember(Long userId, MemberUpdateRequestDTO memberUpdateRequestDTO, MultipartFile image) throws IOException {
        try {
            Optional<Member> optionalMember = memberRepository.findById(userId);
            if (optionalMember.isPresent()) {
                Member member = optionalMember.get();
                member.setName(memberUpdateRequestDTO.getName());
                member.setNickname(memberUpdateRequestDTO.getNickname());
                member.setBirthday(memberUpdateRequestDTO.getBirthday());

                if (memberUpdateRequestDTO.getSidoName() != null || memberUpdateRequestDTO.getGugunName() != null || memberUpdateRequestDTO.getDongName() != null) {
                    String dongCode = findDongCode(memberUpdateRequestDTO.getSidoName(), memberUpdateRequestDTO.getGugunName(), memberUpdateRequestDTO.getDongName());
                    member.setDongCode(dongCode);
                }

                if (image != null && !image.isEmpty()) {
                    String fileUrl = s3Service.uploadFile(image);
                    member.setProfileUrl(fileUrl);
                } else {
                    member.setProfileUrl(null);
                }
                memberRepository.save(member);
                return 1;
            } else {
                throw new IllegalArgumentException("회원 정보를 찾을 수 없습니다.");
            }
        } catch (IOException e) {
            throw new IOException(e);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException(e);
        } catch (Exception e) {
            throw new RuntimeException("회원 정보 수정 중 오류 발생", e);
        }
    }


    @Transactional
    public AuthResponse login(LoginRequest loginRequest) {
        try {
            Member user = memberRepository.findByEmail(loginRequest.getEmail())
                    .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
            );
            SecurityContextHolder.getContext().setAuthentication(authentication);

            String jwt = jwtUtil.generateAccessToken(user);
            String refreshToken = jwtUtil.generateRefreshToken(user);

            Optional<RefreshToken> existingToken = refreshTokenRepository.findById(user.getId());
            RefreshToken token;
            ZonedDateTime zonedDateTime = ZonedDateTime.now(ZoneId.of("Asia/Seoul"));
            LocalDateTime localDateTimeInKorea = zonedDateTime.toLocalDateTime();
            LocalDateTime expireDate = localDateTimeInKorea.plus(jwtUtil.getRefreshTokenExpiration(), ChronoUnit.MILLIS);

            if (existingToken.isPresent()) {
                token = existingToken.get();
                token.setToken(refreshToken);
                token.setExpireDate(expireDate);
            } else {
                token = new RefreshToken();
                token.setToken(refreshToken);
                token.setExpireDate(expireDate);
                token.setUser(user);
            }
            refreshTokenRepository.save(token);

            return new AuthResponse(jwt, refreshToken, true);
        } catch (BadCredentialsException e) {
            throw new RuntimeException(e);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException(e.getMessage(), e);
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage(), e);
        }
    }



    public AuthResponse refreshToken(String cookieRefreshToken) {
        try {
            if (jwtUtil.isTokenExpired(cookieRefreshToken)) {
                throw new ApplicationException.UnauthorizedException("Refresh Token이 만료되었습니다.");
            }
            String email = jwtUtil.extractEmail(cookieRefreshToken);
            Member member = memberRepository.findByEmail(email)
                    .orElseThrow(() -> new IllegalArgumentException("유효하지 않은 이메일입니다."));
            Long userId = member.getId();
            Optional<RefreshToken> refreshToken = refreshTokenRepository.findByUserId(userId);
            if (refreshToken.isPresent() && refreshToken.get().getToken().equals(cookieRefreshToken)) {
                String newAccessToken = jwtUtil.generateAccessToken(memberRepository.findById(userId)
                        .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다.")));
                return new AuthResponse(newAccessToken, cookieRefreshToken, true);
            } else {
                throw new ApplicationException.UnauthorizedException("유효한 Refresh Token이 없습니다.");
            }
        } catch (IllegalArgumentException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage(), e);
        }
    }


    @Transactional
    public void logout(Long userId) {
        try {
            SecurityContextHolder.clearContext();
            jwtUtil.invalidateRefreshTokenByUserId(userId);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }


    public String getUserRole(String token) {
        try {
            return jwtUtil.extractRole(token);
        } catch (Exception e) {
            throw new RuntimeException("회원 권한 조회 실패: " + e.getMessage());
        }
    }

    @Transactional
    public HealthReportResponseDTO saveHealthReport(HealthReportRequestDTO healthReportRequestDTO, Long userId) {
        try {
            HealthReport healthReport = new HealthReport();
            healthReport.setCheckupScore(healthReportRequestDTO.getCheckupScore());
            healthReport.setCheckupDate(LocalDate.now());

            Member member = memberRepository.findById(userId)
                    .orElseThrow(() -> new IllegalArgumentException("유효하지 않은 회원 ID입니다."));
            healthReport.setMember(member);

            HealthReport savedHealthReport = healthReportRepository.save(healthReport);

            HealthReportResponseDTO healthReportResponseDTO = new HealthReportResponseDTO();
            healthReportResponseDTO.setId(savedHealthReport.getId());
            healthReportResponseDTO.setCheckupScore(savedHealthReport.getCheckupScore());
            healthReportResponseDTO.setCheckupDate(savedHealthReport.getCheckupDate());
            healthReportResponseDTO.setMemberId(userId);

            return healthReportResponseDTO;
        } catch (IllegalArgumentException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("자가진단 결과 저장 중 오류 발생", e);
        }
    }



    public List<HealthReportResponseDTO> getHealthReportsByUserId(Long userId) {
        try {
            List<HealthReport> healthReports = healthReportRepository.findByMemberId(userId);
            if (healthReports.isEmpty()) {
                throw new IllegalArgumentException("등록된 결과가 없습니다.");
            }
            return healthReports.stream().map(healthReport -> {
                HealthReportResponseDTO dto = new HealthReportResponseDTO();
                dto.setId(healthReport.getId());
                dto.setCheckupScore(healthReport.getCheckupScore());
                dto.setCheckupDate(healthReport.getCheckupDate());
                dto.setMemberId(userId);
                return dto;
            }).collect(Collectors.toList());
        } catch (IllegalArgumentException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public int duplicateCheckEmail(String email) {
        try {
            int result = memberRepository.countByEmail(email);
            if (result == 1) {
                return 1;
            }
            return 0;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public int duplicateCheckNickname(String nickname) {
        try {
            int result = memberRepository.countByNickname(nickname);
            if (result == 1) {
                return 1;
            }
            return 0;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}