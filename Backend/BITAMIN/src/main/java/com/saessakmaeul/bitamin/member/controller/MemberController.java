package com.saessakmaeul.bitamin.member.controller;

import com.saessakmaeul.bitamin.member.dto.response.MemberBasicInfo;
import com.saessakmaeul.bitamin.member.dto.response.MemberResponseDTO;
import com.saessakmaeul.bitamin.member.entity.Member;
import com.saessakmaeul.bitamin.member.repository.MemberRepository;
import com.saessakmaeul.bitamin.member.service.MemberService;
import com.saessakmaeul.bitamin.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

}
