package com.saessakmaeul.bitamin.member.dto.response;

import com.saessakmaeul.bitamin.member.entity.Role;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;

@Getter
@Setter
@Builder
public class MemberResponseDTO {
    private String email;
    private String password;
    private String name;
    private String nickname;
    private String sidoName;
    private String gugunName;
    private String dongName;
    private String xCoordinate;
    private String yCoordinate;
    private String lat;
    private String lng;
    private LocalDate birthday;
    private String profileUrl;
}
