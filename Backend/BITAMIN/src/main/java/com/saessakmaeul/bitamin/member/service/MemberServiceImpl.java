package com.saessakmaeul.bitamin.member.service;

import com.saessakmaeul.bitamin.member.dto.response.MemberResponseDTO;
import com.saessakmaeul.bitamin.member.entity.Member;
import com.saessakmaeul.bitamin.member.repository.HealthReportRepository;
import com.saessakmaeul.bitamin.member.repository.MemberRepository;
import com.saessakmaeul.bitamin.member.repository.RefreshTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class MemberServiceImpl implements MemberService {
    private final MemberRepository memberRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final HealthReportRepository healthReportRepository;

    @Autowired
    public MemberServiceImpl(MemberRepository memberRepository, RefreshTokenRepository refreshTokenRepository, @Lazy PasswordEncoder passwordEncoder, HealthReportRepository healthReportRepository) {
        this.memberRepository = memberRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.healthReportRepository = healthReportRepository;
    }

    @Override
    @Transactional
    public Long register(MemberResponseDTO memberDTO) {
        Member member = Member.builder()
                .email(memberDTO.getEmail())
                .password(passwordEncoder.encode(memberDTO.getPassword()))
                .name(memberDTO.getName())
                .nickname(memberDTO.getNickname())
                .dongCode(memberDTO.getDongCode())
                .birthday(memberDTO.getBirthday())
                .profileKey(memberDTO.getProfileKey())
                .profileUrl(memberDTO.getProfileUrl())
                .role(memberDTO.getRole())
                .build();

        return memberRepository.save(member).getId();
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
    public void changePassword(String email, String newPassword) {
        Member member = getMember(email).orElseThrow(() -> new RuntimeException("멤버를 찾을 수 없음"));
        member.setPassword(passwordEncoder.encode(newPassword));
        memberRepository.save(member);
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
        // 회원 id랑 연결된 모든 테이블의 repository를 넣으삼.deleteByMemberId(memberId);
        refreshTokenRepository.deleteByUserId(memberId);
        healthReportRepository.findByMemberId(memberId);

        // 최최종 Member 테이블에서 삭제
        memberRepository.deleteById(memberId);
    }
}