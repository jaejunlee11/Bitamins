package com.saessakmaeul.bitamin.security;

import com.saessakmaeul.bitamin.member.entity.Member;
import com.saessakmaeul.bitamin.member.dto.response.MemberResponseDTO;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;
import java.util.Date;

public class UserPrincipal implements UserDetails {

    private Long id;
    private String email;
    private String password;
    private String name;
    private String nickname;
    private String dongCode;
    private Date birthday;
    private String profileKey;
    private String profileUrl;
    private MemberResponseDTO.Role role;
    private Collection<? extends GrantedAuthority> authorities;

    public UserPrincipal(Long id, String email, String password, String name, String nickname, String dongCode, Date birthday, String profileKey, String profileUrl, MemberResponseDTO.Role role, Collection<? extends GrantedAuthority> authorities) {
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
        this.authorities = authorities;
    }

    public static UserPrincipal create(Member member) {
        Collection<? extends GrantedAuthority> authorities = Collections.singletonList(
                new SimpleGrantedAuthority(member.getRole().name())
        );

        return new UserPrincipal(
                member.getId(),
                member.getEmail(),
                member.getPassword(),
                member.getName(),
                member.getNickname(),
                member.getDongCode(),
                member.getBirthday(),
                member.getProfileKey(),
                member.getProfileUrl(),
                member.getRole(),
                authorities
        );
    }

    public Long getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public String getName() {
        return name;
    }

    public String getNickname() {
        return nickname;
    }

    public String getDongCode() {
        return dongCode;
    }

    public Date getBirthday() {
        return birthday;
    }

    public String getProfileKey() {
        return profileKey;
    }

    public String getProfileUrl() {
        return profileUrl;
    }

    public MemberResponseDTO.Role getRole() {
        return role;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    public Member getMember() {
        return new Member(
                id, email, password, name, nickname, dongCode, birthday, profileKey, profileUrl, role
        );
    }
}
