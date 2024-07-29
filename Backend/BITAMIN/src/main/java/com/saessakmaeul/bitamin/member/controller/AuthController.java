package com.saessakmaeul.bitamin.member.controller;

import com.saessakmaeul.bitamin.member.dto.request.LoginRequest;
import com.saessakmaeul.bitamin.member.dto.response.AuthResponse;
import com.saessakmaeul.bitamin.member.entity.Member;
import com.saessakmaeul.bitamin.member.entity.RefreshToken;
import com.saessakmaeul.bitamin.member.repository.MemberRepository;
import com.saessakmaeul.bitamin.member.repository.RefreshTokenRepository;
import com.saessakmaeul.bitamin.util.JwtUtil;
import io.swagger.v3.oas.annotations.Operation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    @Autowired
    private MemberRepository memberRepository;

    @Operation(summary = "로그인", description = "로그인 시 AccessToken, RefreshToken 생성 && 기존의 RefreshToken이 존재한다면 토큰 업데이트")
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
            );
            SecurityContextHolder.getContext().setAuthentication(authentication);
            Member user = memberRepository.findByEmail(loginRequest.getEmail()).orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
            String jwt = jwtUtil.generateAccessToken(user);
            String refreshToken = jwtUtil.generateRefreshToken(user);
            // 기존 RefreshToken이 있으면 업데이트, 없으면 생성
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
            return ResponseEntity.ok(new AuthResponse(jwt, refreshToken, true));
        } catch (Exception e) {
            logger.error("로그인 오류: ", e);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인 실패: " + e.getMessage());
        }
    }

    @Operation(summary = "AccessToken 재생성", description = "AccessToken에서 사용자 ID를 추출하여 RefreshToken을 자동으로 검색하고, 유효하다면 AcceessToken을 재생성")
    @PostMapping("/refresh-token")
    public ResponseEntity<?> refreshToken() {
        try {
            // SecurityContextHolder를 통해 AccessToken 가져오기
            UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            Long userId = jwtUtil.extractUserIdFromPrincipal(userDetails);
            // 사용자 ID로 RefreshToken 검색
            Optional<RefreshToken> refreshToken = refreshTokenRepository.findByUserId(userId);
            if (refreshToken.isPresent()) {
                String requestRefreshToken = refreshToken.get().getToken();
                if (!jwtUtil.isTokenExpired(requestRefreshToken)) {
                    String newToken = jwtUtil.generateAccessToken(memberRepository.findById(userId).orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다.")));
                    return ResponseEntity.ok(new AuthResponse(newToken, requestRefreshToken, true));
                } else {
                    logger.info("만료된 Refresh Token: {}", requestRefreshToken);
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Refresh Token이 만료되었습니다.");
                }
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("유효한 Refresh Token이 없습니다.");
            }
        } catch (Exception e) {
            logger.error("AccessToken 재생성 오류: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("AccessToken 재생성 실패: " + e.getMessage());
        }
    }

    @Operation(summary = "로그아웃 테스트", description = "로그아웃 시 RefreshToken 삭제 없이 처리")
    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestBody LoginRequest loginRequest) {
        try {
            SecurityContextHolder.clearContext();
            logger.info("로그아웃 됨: {}", loginRequest.getEmail());
            return ResponseEntity.ok("로그아웃 성공");
        } catch (Exception e) {
            logger.error("로그아웃 오류: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("로그아웃 실패: " + e.getMessage());
        }
    }
}
