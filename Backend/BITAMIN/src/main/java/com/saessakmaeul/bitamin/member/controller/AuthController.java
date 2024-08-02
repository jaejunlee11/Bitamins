package com.saessakmaeul.bitamin.member.controller;

import com.saessakmaeul.bitamin.member.dto.request.LoginRequest;
import com.saessakmaeul.bitamin.member.dto.request.MemberRequestDTO;
import com.saessakmaeul.bitamin.member.dto.response.AuthResponse;
import com.saessakmaeul.bitamin.member.service.MemberService;
import com.saessakmaeul.bitamin.util.JwtUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private MemberService memberService;

    @Autowired
    private JwtUtil jwtUtil;

    /** 로그인 API
     * @param loginRequest 로그인 요청 정보
     * @param response HTTP 응답 객체
     * @return AccessToken과 RefreshToken을 포함한 응답 */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest, HttpServletResponse response) {
        try {
            AuthResponse authResponse = memberService.login(loginRequest);

            response.setHeader("Authorization", "Bearer " + authResponse.getAccessToken());

            Cookie refreshTokenCookie = new Cookie("refresh_token", authResponse.getRefreshToken());
            refreshTokenCookie.setHttpOnly(true);
            refreshTokenCookie.setPath("/");
            refreshTokenCookie.setMaxAge((int) jwtUtil.getRefreshTokenExpiration() / 1000); // 초 단위로 설정
            response.addCookie(refreshTokenCookie);

            return ResponseEntity.ok(authResponse);
        } catch (Exception e) {
            logger.error("로그인 오류: ", e);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인 실패: " + e.getMessage());
        }
    }

    /** AccessToken 재생성 API
     * @param request HTTP 요청 객체
     * @param response HTTP 응답 객체
     * @return 새로운 AccessToken을 포함한 응답 */
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
            AuthResponse authResponse = memberService.refreshToken(cookieRefreshToken);
            response.setHeader("Authorization", "Bearer " + authResponse.getAccessToken());
            return ResponseEntity.ok(authResponse);
        } catch (Exception e) {
            logger.error("AccessToken 재생성 오류: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("AccessToken 재생성 실패: " + e.getMessage());
        }
    }

    /** 로그아웃 API
     * @param request HTTP 요청 객체
     * @return 로그아웃 결과 메시지 */
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        try {
            String token = getTokenFromRequest(request);
            if (token == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("토큰이 제공되지 않았습니다.");
            }
            Long userId = jwtUtil.extractUserId(token);
            if (userId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("유효하지 않은 토큰입니다.");
            }
            memberService.logout(userId);
            return ResponseEntity.ok("로그아웃 성공");
        } catch (Exception e) {
            logger.error("로그아웃 오류: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("로그아웃 실패: " + e.getMessage());
        }
    }

    /** 회원 권한 조회 API
     * @param request HTTP 요청 객체
     * @return 회원 권한 정보 */
    @GetMapping("/role")
    public ResponseEntity<String> getUserRole(HttpServletRequest request) {
        try {
            String token = getTokenFromRequest(request);
            if (token == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            String role = memberService.getUserRole(token);
            return ResponseEntity.ok(role);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /** JWT 토큰 추출 메서드
     * @param request HTTP 요청 객체
     * @return 추출된 JWT 토큰 */
    private String getTokenFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
