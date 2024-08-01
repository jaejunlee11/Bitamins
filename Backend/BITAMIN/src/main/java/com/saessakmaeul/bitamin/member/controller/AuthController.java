package com.saessakmaeul.bitamin.member.controller;

import com.saessakmaeul.bitamin.member.dto.request.LoginRequest;
import com.saessakmaeul.bitamin.member.dto.response.AuthResponse;
import com.saessakmaeul.bitamin.member.entity.Member;
import com.saessakmaeul.bitamin.member.entity.RefreshToken;
import com.saessakmaeul.bitamin.member.repository.MemberRepository;
import com.saessakmaeul.bitamin.member.repository.RefreshTokenRepository;
import com.saessakmaeul.bitamin.util.JwtUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
@Tag(name = "Auth Controller", description = "권한, 토큰 관리하는 컨트롤러")
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
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest, HttpServletResponse response) {
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

            response.setHeader("Authorization", "Bearer " + jwt);

            Cookie refreshTokenCookie = new Cookie("refresh_token", refreshToken);
            refreshTokenCookie.setHttpOnly(true);
            refreshTokenCookie.setPath("/");
            refreshTokenCookie.setMaxAge((int) jwtUtil.getRefreshTokenExpiration() / 1000); // 초 단위로 설정
            response.addCookie(refreshTokenCookie);

            return ResponseEntity.ok(new AuthResponse(jwt, refreshToken, true));
        } catch (Exception e) {
            logger.error("로그인 오류: ", e);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인 실패: " + e.getMessage());
        }
    }


    @Operation(summary = "AccessToken 재생성", description = "쿠키의 RefreshToken을 DB의 RefreshToken과 비교하여 유효하다면 AccessToken을 재생성")
    @PostMapping("/refresh-token")
    public ResponseEntity<?> refreshToken(HttpServletRequest request, HttpServletResponse response) {
        try {
            String cookieRefreshToken = null;
            Cookie[] cookies = request.getCookies();
            if (cookies != null) {
                for (Cookie cookie : cookies) {
                    if ("refresh_token".equals(cookie.getName())) {
                        cookieRefreshToken = cookie.getValue();
                    }
                }
            }
            if (cookieRefreshToken == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Refresh Token이 쿠키에 존재하지 않습니다.");
            }
            if (jwtUtil.isTokenExpired(cookieRefreshToken)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Refresh Token이 만료되었습니다.");
            }
            Long userId = jwtUtil.extractUserId(cookieRefreshToken);
            Optional<RefreshToken> refreshToken = refreshTokenRepository.findByUserId(userId);
            if (refreshToken.isPresent() && refreshToken.get().getToken().equals(cookieRefreshToken)) {
                String newAccessToken = jwtUtil.generateAccessToken(memberRepository.findById(userId)
                        .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다.")));

                response.setHeader("Authorization", "Bearer " + newAccessToken);
                return ResponseEntity.ok(new AuthResponse(newAccessToken, cookieRefreshToken, true));
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

    @Operation(summary = "회원 권한 조회", description = "AccessToken 파싱해서 회원 권한 조회")
    @GetMapping("/role")
    public ResponseEntity<String> getUserRole(HttpServletRequest request) {
        try {
            String token = getTokenFromRequest(request);
            if (token == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            String role = jwtUtil.extractRole(token);
            return ResponseEntity.ok(role);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @Operation(summary = "JWT 토큰 추출 메서드", description = "헤더에서 JWT 토큰을 추출하는 메서드")
    private String getTokenFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }

}
