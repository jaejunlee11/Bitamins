package com.saessakmaeul.bitamin.mission.service;

import com.saessakmaeul.bitamin.mission.dto.request.MemberPhraseRequest;
import com.saessakmaeul.bitamin.mission.dto.response.MemberPhraseResponse;
import com.saessakmaeul.bitamin.mission.entity.MemberPhrase;
import com.saessakmaeul.bitamin.mission.repository.MemberPhraseRepository;
import com.saessakmaeul.bitamin.service.S3Service;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MemberPhraseService {

    private final MemberPhraseRepository memberPhraseRepository;
    private final S3Service s3Service;

    // 오늘의 문구 녹음 등록
    @Transactional
    public MemberPhraseResponse createMemberPhrase(Long memberId, MemberPhraseRequest memberPhraseRequest) throws IOException {
        // MemberPhraseRequest에서 LocalDate로 변환
        LocalDate saveDate = LocalDate.parse(memberPhraseRequest.getSaveDate(), DateTimeFormatter.ISO_DATE);

        // S3에 녹음파일 업로드
        MultipartFile phraseRecord = memberPhraseRequest.getPhraseRecord();
        String phraseUrl = null;
        if(phraseRecord != null && !phraseRecord.isEmpty()) {
            phraseUrl = s3Service.uploadFile(phraseRecord);
        }

        // MemberPhrase 엔티티 생성
        MemberPhrase memberPhrase = new MemberPhrase();
        memberPhrase.setSaveDate(saveDate);
        memberPhrase.setPhraseUrl(phraseUrl);
        memberPhrase.setPhraseId(memberPhraseRequest.getPhraseId());
        memberPhrase.setMemberId(memberId);

        // 저장하기
        MemberPhrase savedMemberPhrase = memberPhraseRepository.save(memberPhrase);

        return MemberPhraseResponse.builder()
                .id(savedMemberPhrase.getId())
                .memberId(savedMemberPhrase.getMemberId())
                .phraseId(savedMemberPhrase.getPhraseId())
                .saveDate(savedMemberPhrase.getSaveDate())
                .phraseUrl(savedMemberPhrase.getPhraseUrl())
                .build();
    }
}
