package com.saessakmaeul.bitamin.member.controller;

import com.saessakmaeul.bitamin.member.dto.request.ChangePasswordRequest;
import com.saessakmaeul.bitamin.member.dto.request.CheckPasswordRequest;
import com.saessakmaeul.bitamin.member.dto.request.MemberRequestDTO;
import com.saessakmaeul.bitamin.member.dto.request.MemberUpdateRequestDTO;
import com.saessakmaeul.bitamin.member.dto.response.MemberBasicInfo;
import com.saessakmaeul.bitamin.member.dto.response.MemberResponseDTO;
import com.saessakmaeul.bitamin.member.service.MemberService;
import com.saessakmaeul.bitamin.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.context.annotation.Lazy;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/members")
@CrossOrigin(origins = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
@Tag(name = "Member Controller", description = "회원 관리하는 컨트롤러")
public class MemberController {
    private final MemberService memberService;
    private final JwtUtil jwtUtil;

    public MemberController(@Lazy MemberService memberService, JwtUtil jwtUtil) {
        this.memberService = memberService;
        this.jwtUtil = jwtUtil;
    }

    @Operation(summary = "회원 목록 조회", description = "테스트용")
    @GetMapping("/list")
    public ResponseEntity<List<MemberResponseDTO>> getMemberList() {
        try {
            List<MemberResponseDTO> members = memberService.getMemberList();
            return ResponseEntity.ok(members);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @Operation(summary = "회원가입", description = "")
    @PostMapping("/register")
    public ResponseEntity<Long> register(@ModelAttribute MemberResponseDTO memberDTO) {
        try {
            Long memberId = memberService.register(memberDTO);
            return ResponseEntity.ok(memberId);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @Operation(summary = "회원 한명 조회", description = "")
    @GetMapping("/get-member")
    public ResponseEntity<MemberRequestDTO> getMemberByToken(HttpServletRequest request) {
        try {
            String token = getTokenFromRequest(request);
            if (token == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            Long userId = jwtUtil.extractUserId(token);
            MemberRequestDTO member = memberService.getMemberById(userId);
            return member != null ? ResponseEntity.ok(member) : ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @Operation(summary = "회원 정보 수정", description = "수정 완료하면 1 반환")
    @PutMapping("/update-member")
    public ResponseEntity<Integer> updateMemberByToken(HttpServletRequest request, @ModelAttribute MemberUpdateRequestDTO memberUpdateRequestDTO) {
        try {
            String token = getTokenFromRequest(request);
            if (token == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            Long userId = jwtUtil.extractUserId(token);
            int updateResult = memberService.updateMember(userId, memberUpdateRequestDTO);
            return updateResult == 1 ? ResponseEntity.ok(updateResult) : ResponseEntity.status(HttpStatus.NOT_FOUND).body(updateResult);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(0);
        }
    }

    @Operation(summary = "회원 id, 닉네임 조회", description = "AccessToken 파싱해서 회원 id, 닉네임 조회")
    @GetMapping("/info")
    public ResponseEntity<MemberBasicInfo> getUserInfo(HttpServletRequest request) {
        try {
            String token = getTokenFromRequest(request);
            if (token == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            Long userId = jwtUtil.extractUserId(token);
            String nickname = jwtUtil.extractNickname(token);
            return ResponseEntity.ok(new MemberBasicInfo(userId, nickname));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @Operation(summary = "회원 비밀번호 수정", description = "비밀번호 변경")
    @PostMapping("/change-password")
    public ResponseEntity<String> changePassword(HttpServletRequest request, @RequestBody ChangePasswordRequest changePasswordRequest) {
        try {
            String token = getTokenFromRequest(request);
            if (token == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            Long userId = jwtUtil.extractUserId(token);
            boolean isPasswordChanged = memberService.changePassword(userId, changePasswordRequest);
            return isPasswordChanged ? ResponseEntity.ok("비밀번호 변경 완료") : ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("현재 비밀번호가 일치하지 않습니다.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("비밀번호 변경 중 오류 발생");
        }
    }

    @Operation(summary = "회원 비밀번호 확인", description = "회원 탈퇴 전 비밀번호 확인")
    @PostMapping("/check-password")
    public ResponseEntity<Integer> checkPassword(@RequestBody CheckPasswordRequest checkPasswordRequest) {
        try {
            UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            String email = userDetails.getUsername();

            boolean isPasswordCorrect = memberService.checkPassword(email, checkPasswordRequest.getPassword());
            return ResponseEntity.ok(isPasswordCorrect ? 1 : 0);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(0);
        }
    }

    @Operation(summary = "회원 탈퇴", description = "회원 탈퇴 및 관련 정보 삭제 & 로그아웃")
    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteMember(HttpServletRequest request, HttpServletResponse response) {
        try {
            String token = getTokenFromRequest(request);
            if (token == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
            Long memberId = jwtUtil.extractUserId(token);
            memberService.deleteMember(memberId);
            // 로그아웃 처리
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null) {
                new SecurityContextLogoutHandler().logout(request, response, auth);
            }
            return ResponseEntity.ok("회원 탈퇴 및 로그아웃 완료");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("회원 탈퇴 중 오류 발생");
        }
    }

    @Operation(summary = "JWT 토큰 추출 메서드", description = "헤더에서 JWT 토큰을 추출하는 메서드")
    private String getTokenFromRequest(HttpServletRequest request) {
        String authorizationHeader = request.getHeader("Authorization");
        return authorizationHeader != null && authorizationHeader.startsWith("Bearer ") ? authorizationHeader.substring(7) : null;
    }

}
