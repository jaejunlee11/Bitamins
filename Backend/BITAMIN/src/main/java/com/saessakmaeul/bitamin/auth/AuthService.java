package com.saessakmaeul.bitamin.auth;

import com.saessakmaeul.bitamin.member.entity.Member;
import com.saessakmaeul.bitamin.member.repository.MemberRepository;
import com.saessakmaeul.bitamin.security.JwtTokenProvider;
import com.saessakmaeul.bitamin.token.RefreshToken;
import com.saessakmaeul.bitamin.token.RefreshTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    @Autowired
    private MemberRepository memberRepository;

    public String authenticateUser(String email, String password) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, password)
            );

            String jwtToken = tokenProvider.generateToken(authentication);

            Member member = memberRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            String refreshTokenValue = tokenProvider.generateRefreshToken();
            RefreshToken refreshToken = new RefreshToken();
            refreshToken.setId(member.getId());
            refreshToken.setRefreshToken(refreshTokenValue);
            refreshToken.setExpireDate(LocalDateTime.now().plus(7, ChronoUnit.DAYS));
            refreshTokenRepository.save(refreshToken);

            return jwtToken;
        } catch (AuthenticationException e) {
            throw new RuntimeException("Invalid email/password supplied", e);
        }
    }
}
