package com.saessakmaeul.bitamin.member.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@Builder
public class MemberDTO {
    private long id;
    private String email;
    private String password;
    private String name;
    private String nickname;
    private String dongCode;
    private Date birthday;
    private String profileKey;
    private String profileUrl;
    private Role role;

    public enum Role {
        ROLE_MEMBER, ROLE_ADMIN
    }
}
