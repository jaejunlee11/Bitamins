package com.saessakmaeul.bitamin.member.controller;

import com.saessakmaeul.bitamin.member.dto.request.ChangePasswordRequest;
import com.saessakmaeul.bitamin.member.dto.request.CheckPasswordRequest;
import com.saessakmaeul.bitamin.member.dto.response.MemberBasicInfo;
import com.saessakmaeul.bitamin.member.dto.response.MemberResponseDTO;
import com.saessakmaeul.bitamin.member.entity.Member;
import com.saessakmaeul.bitamin.member.repository.MemberRepository;
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

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/members")
@CrossOrigin(origins = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
@Tag(name = "Member Controller", description = "회원 관리하는 컨트롤러")
public class MemberController {
    private final MemberService memberService;
    private final JwtUtil jwtUtil;

    public MemberController(@Lazy MemberService memberService, MemberRepository memberRepository, JwtUtil jwtUtil) {
        this.memberService = memberService;
        this.jwtUtil = jwtUtil;
    }

    @Operation(summary = "회원가입", description = "")
    @PostMapping("/register")
    public Long register(@RequestBody MemberResponseDTO user) {
        return memberService.register(user);
    }

    @Operation(summary = "회원 한명 조회", description = "테스트용")
    @GetMapping("/get-member")
    public ResponseEntity<Member> getMemberByEmail(@RequestParam String email) {
        Optional<Member> member = memberService.getMember(email);
        return member.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @Operation(summary = "회원 목록 조회", description = "테스트용")
    @GetMapping("/list")
    public ResponseEntity<List<MemberResponseDTO>> getMemberList() {
        List<MemberResponseDTO> members = memberService.getMemberList();
        return ResponseEntity.ok(members);
    }

    // swagger test -> Authorize 버튼 클릭해서 accesstoken 넣고 info test
    @Operation(summary = "회원 id, 닉네임 조회", description = "AccessToken 파싱해서 회원 id, 닉네임 조회")
    @GetMapping("/info")
    public MemberBasicInfo getUserInfo(HttpServletRequest request) {
        String authorizationHeader = request.getHeader("Authorization");

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            String accessToken = authorizationHeader.substring(7);
            Long userId = jwtUtil.extractUserId(accessToken);
            String nickname = jwtUtil.extractNickname(accessToken);
            return new MemberBasicInfo(userId, nickname);
        } else {
            throw new RuntimeException("access token 확인 불가");
        }
    }

    @Operation(summary = "회원 비밀번호 확인", description = "비밀번호 변경 전 사용자 비밀번호 일치 여부 확인")
    @PostMapping("/check-password")
    public ResponseEntity<Integer> checkPassword(@RequestBody CheckPasswordRequest checkPasswordRequest) {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String email = userDetails.getUsername();

        boolean isPasswordCorrect = memberService.checkPassword(email, checkPasswordRequest.getPassword());
        return ResponseEntity.ok(isPasswordCorrect ? 1 : 0);
    }

    @Operation(summary = "회원 비밀번호 수정", description = "비밀번호 변경")
    @PostMapping("/change-password")
    public ResponseEntity<String> changePassword(@RequestBody ChangePasswordRequest changePasswordRequest) {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String email = userDetails.getUsername();

        memberService.changePassword(email, changePasswordRequest.getNewPassword());
        return ResponseEntity.ok("비밀번호 변경 완료");
    }

    @Operation(summary = "회원 탈퇴", description = "회원 탈퇴 및 관련 정보 삭제 & 로그아웃")
    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteMember(HttpServletRequest request, HttpServletResponse response) {
        String authorizationHeader = request.getHeader("Authorization");

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            String accessToken = authorizationHeader.substring(7);
            Long memberId = jwtUtil.extractUserId(accessToken);
            memberService.deleteMember(memberId);
            // 로그아웃 처리
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null) {
                new SecurityContextLogoutHandler().logout(request, response, auth);
            }
            return ResponseEntity.ok("회원 탈퇴 및 로그아웃 완료");
        } else {
            throw new RuntimeException("access token 확인 불가");
        }
    }

}
