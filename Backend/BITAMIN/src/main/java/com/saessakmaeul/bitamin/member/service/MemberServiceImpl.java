package com.saessakmaeul.bitamin.member.service;

import com.saessakmaeul.bitamin.member.dto.response.MemberResponseDTO;
import com.saessakmaeul.bitamin.member.entity.Member;
import com.saessakmaeul.bitamin.member.repository.MemberRepository;
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
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public MemberServiceImpl(MemberRepository memberRepository, @Lazy PasswordEncoder passwordEncoder) {
        this.memberRepository = memberRepository;
        this.passwordEncoder = passwordEncoder;
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
}
