package com.saessakmaeul.bitamin.member.controller;

import com.saessakmaeul.bitamin.member.dto.request.LoginRequest;
import com.saessakmaeul.bitamin.member.dto.response.AuthResponse;
import com.saessakmaeul.bitamin.member.entity.Member;
import com.saessakmaeul.bitamin.member.entity.RefreshToken;
import com.saessakmaeul.bitamin.member.repository.MemberRepository;
import com.saessakmaeul.bitamin.member.repository.RefreshTokenRepository;
import com.saessakmaeul.bitamin.member.util.JwtUtil;
import io.swagger.v3.oas.annotations.Operation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
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

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        Member user = memberRepository.findByEmail(loginRequest.getEmail()).orElseThrow();

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
    }

    // swagger test -> Authorize 버튼 클릭해서 accesstoken 넣고 /refresh-token test
    @Operation(summary = "AccessToken 재생성", description = "AccessToken에서 사용자 ID를 추출하여 RefreshToken을 자동으로 검색하고, 유효하다면 AcceessToken을 재생성")
    @PostMapping("/refresh-token")
    public ResponseEntity<?> refreshToken() {
        // SecurityContextHolder를 통해 AccessToken 가져오기
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Long userId = jwtUtil.extractUserIdFromPrincipal(userDetails);

        // 사용자 ID로 RefreshToken 검색
        Optional<RefreshToken> refreshToken = refreshTokenRepository.findByUserId(userId);

        if (refreshToken.isPresent()) {
            String requestRefreshToken = refreshToken.get().getToken();
            if (!jwtUtil.isTokenExpired(requestRefreshToken)) {
                String newToken = jwtUtil.generateAccessToken(memberRepository.findById(userId).orElseThrow());
                return ResponseEntity.ok(new AuthResponse(newToken, requestRefreshToken, true));
            } else {
                // 만료된 리프레시 토큰 처리 -> false 반환하면 프론트에서 로그인창으로 이동..?
                logger.info("만료된 Refresh Token: {}", requestRefreshToken);
                return ResponseEntity.ok(new AuthResponse(null, null, false));
            }
        } else {
            return ResponseEntity.ok(new AuthResponse(null, null, false));
        }
    }




    @Operation(summary = "로그아웃 테스트", description = "로그아웃 시 RefreshToken 삭제 없이 처리")
    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestBody LoginRequest loginRequest) {
        SecurityContextHolder.clearContext();
        logger.info("로그아웃 됨: {}", loginRequest.getEmail());

        return ResponseEntity.ok("로그아웃 성공");
    }

    //    @Operation(summary = "로그아웃", description = "헤더에 AccessToken에서 정보 가지고 오는 실제 로그아웃")
//    @PostMapping("/logout")
//    public ResponseEntity<?> logout(HttpServletRequest request) {
//        String authHeader = request.getHeader("Authorization");
//
//        if (authHeader != null && authHeader.startsWith("Bearer ")) {
//            String token = authHeader.substring(7);
//            String email = jwtUtil.extractUsername(token);
//
//            Member user = memberRepository.findByEmail(email).orElseThrow();
//
//            SecurityContextHolder.clearContext();
//            logger.info("로그아웃 됨: {}", email);
//
//            return ResponseEntity.ok("Logout successful");
//        } else {
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("실패");
//        }
//    }
}
