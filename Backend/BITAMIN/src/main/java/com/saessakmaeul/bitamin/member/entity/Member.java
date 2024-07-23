package com.saessakmaeul.bitamin.member.entity;

import com.saessakmaeul.bitamin.member.dto.response.MemberResponseDTO;
import com.saessakmaeul.bitamin.token.RefreshToken;
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
    @Column(name = "id")
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
    private MemberResponseDTO.Role role;

    @OneToOne(mappedBy = "member", cascade = CascadeType.ALL)
    private RefreshToken refreshToken;

    public Member(Long id, String email, String password, String name, String nickname, String dongCode, Date birthday, String profileKey, String profileUrl, MemberResponseDTO.Role role) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.name = name;
        this.nickname = nickname;
        this.dongCode = dongCode;
        this.birthday = birthday;
        this.profileKey = profileKey;
        this.profileUrl = profileUrl;
        this.role = role;
    }

    public enum Role {
        ROLE_MEMBER, ROLE_ADMIN
    }
}
