package com.saessakmaeul.bitamin.member.entity;

import com.saessakmaeul.bitamin.member.dto.MemberDTO;
import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "member")
public class Member {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(nullable = false)
    private String email;
    @Column(nullable = false)
    private String password;
    @Column(nullable = false)
    private String name;

    @Column(unique = true, nullable = false)
    private String nickname;
    @Column(nullable = false)
    private String dongCode;
    @Column(nullable = false)
    private Date birthday;

    private String profileKey;
    private String profileUrl;

    @Enumerated(EnumType.STRING)
    private MemberDTO.Role role;

    public enum Role {
        ROLE_MEMBER, ROLE_ADMIN
    }
}
