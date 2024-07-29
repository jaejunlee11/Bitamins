package com.saessakmaeul.bitamin.member.service;

import com.saessakmaeul.bitamin.member.dto.request.ChangePasswordRequest;
import com.saessakmaeul.bitamin.member.dto.request.MemberRequestDTO;
import com.saessakmaeul.bitamin.member.dto.request.MemberUpdateRequestDTO;
import com.saessakmaeul.bitamin.member.dto.response.MemberResponseDTO;
import com.saessakmaeul.bitamin.member.entity.Member;
import com.saessakmaeul.bitamin.member.repository.HealthReportRepository;
import com.saessakmaeul.bitamin.member.repository.MemberRepository;
import com.saessakmaeul.bitamin.member.repository.RefreshTokenRepository;
import com.saessakmaeul.bitamin.service.S3Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class MemberServiceImpl implements MemberService {
    private final MemberRepository memberRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final HealthReportRepository healthReportRepository;

    @Autowired
    private S3Service s3Service;

    @Autowired
    public MemberServiceImpl(MemberRepository memberRepository, RefreshTokenRepository refreshTokenRepository, @Lazy PasswordEncoder passwordEncoder, HealthReportRepository healthReportRepository) {
        this.memberRepository = memberRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.healthReportRepository = healthReportRepository;
    }

    @Override
    @Transactional
    public Long register(MemberResponseDTO memberDTO) throws IOException {
        Member member = Member.builder()
                .email(memberDTO.getEmail())
                .password(passwordEncoder.encode(memberDTO.getPassword()))
                .name(memberDTO.getName())
                .nickname(memberDTO.getNickname())
                .dongCode(memberDTO.getDongCode())
                .birthday(memberDTO.getBirthday())
                .role(memberDTO.getRole())
                .build();
        member = memberRepository.save(member);
        if (memberDTO.getProfileImage() != null && !memberDTO.getProfileImage().isEmpty()) {
            String fileName = UUID.randomUUID() + "_" + memberDTO.getProfileImage().getOriginalFilename();
            String profileUrl = s3Service.uploadFile(memberDTO.getProfileImage());

            member.setProfileKey(fileName);
            member.setProfileUrl(profileUrl);
        }
        memberRepository.save(member);
        return member.getId();
        // 1차 저장 후 2차 저장
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
    public boolean changePassword(Long userId, ChangePasswordRequest changePasswordRequest) {
        Optional<Member> optionalMember = memberRepository.findById(userId);
        if (optionalMember.isPresent()) {
            Member member = optionalMember.get();
            if (passwordEncoder.matches(changePasswordRequest.getCurrentPassword(), member.getPassword())) {
                member.setPassword(passwordEncoder.encode(changePasswordRequest.getNewPassword()));
                memberRepository.save(member);
                return true;
            }
        }
        return false;
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
        // 회원 id랑 연결된 모든 테이블의 repository를 넣어야함.deleteByMemberId(memberId);
        refreshTokenRepository.deleteByUserId(memberId);
        healthReportRepository.findByMemberId(memberId);

        // 최최종 Member 테이블에서 삭제
        memberRepository.deleteById(memberId);
    }

    @Override
    public MemberRequestDTO getMemberById(Long userId) {
        Optional<Member> optionalMember = memberRepository.findById(userId);
        if (optionalMember.isPresent()) {
            Member member = optionalMember.get();
            return MemberRequestDTO.builder()
                    .email(member.getEmail())
                    .password(member.getPassword())
                    .name(member.getName())
                    .nickname(member.getNickname())
                    .dongCode(member.getDongCode())
                    .birthday(member.getBirthday())
                    .profileKey(member.getProfileKey())
                    .profileUrl(member.getProfileUrl())
                    .build();
        } else {
            return null;
        }
    }

    @Override
    @Transactional
    public int updateMember(Long userId, MemberUpdateRequestDTO memberUpdateRequestDTO) throws IOException {
        Optional<Member> optionalMember = memberRepository.findById(userId);
        if (optionalMember.isPresent()) {
            Member member = optionalMember.get();
            member.setName(memberUpdateRequestDTO.getName());
            member.setNickname(memberUpdateRequestDTO.getNickname());
            member.setDongCode(memberUpdateRequestDTO.getDongCode());
            member.setBirthday(memberUpdateRequestDTO.getBirthday());
            if (memberUpdateRequestDTO.getProfileImage() != null && !memberUpdateRequestDTO.getProfileImage().isEmpty()) {
                String fileName = UUID.randomUUID() + "_" + memberUpdateRequestDTO.getProfileImage().getOriginalFilename();
                String profileUrl = s3Service.uploadFile(memberUpdateRequestDTO.getProfileImage());

                member.setProfileKey(fileName);
                member.setProfileUrl(profileUrl);
            }
            memberRepository.save(member);
            return 1;
        } else {
            return 0;
        }
    }
}