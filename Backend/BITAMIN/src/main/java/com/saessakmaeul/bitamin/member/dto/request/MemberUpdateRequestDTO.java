package com.saessakmaeul.bitamin.member.dto.request;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.Date;

@Getter
@Setter
@Builder
public class MemberUpdateRequestDTO {
    private String name;
    private String nickname;
    private String sidoName;
    private String gugunName;
    private String dongName;
    private String dongCode;
    private LocalDate birthday;
    private String profileKey;
    private String profileUrl;
    private MultipartFile profileImage;
}
