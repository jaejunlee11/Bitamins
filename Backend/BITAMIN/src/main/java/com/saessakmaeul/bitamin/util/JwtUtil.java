package com.saessakmaeul.bitamin.util;

import com.saessakmaeul.bitamin.member.entity.Member;
import com.saessakmaeul.bitamin.member.repository.MemberRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.security.Key;
import java.util.Date;
import java.util.function.Function;

@Component
public class JwtUtil {

    @Autowired
    private MemberRepository memberRepository;

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration.access}")
    private long accessTokenExpiration;

    @Value("${jwt.expiration.refresh}")
    private long refreshTokenExpiration;

    private Key key;

    @PostConstruct
    public void init() {
        byte[] keyBytes = Decoders.BASE64.decode(secret);
        this.key = Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateAccessToken(Member member) {
        return generateAccessTokenWithFullInfo(member, accessTokenExpiration);
    }

    public String generateRefreshToken(Member member) {
        return generateRefreshTokenWithMinimalInfo(member.getEmail(), refreshTokenExpiration);
    }

    private String generateAccessTokenWithFullInfo(Member member, long expiration) {
        return Jwts.builder()
                .setSubject(member.getEmail())
                .claim("id", member.getId())
                .claim("email", member.getEmail())
                .claim("name", member.getName())
                .claim("nickname", member.getNickname())
                .claim("dongCode", member.getDongCode())
                .claim("birthday", member.getBirthday())
                .claim("profileKey", member.getProfileKey())
                .claim("profileUrl", member.getProfileUrl())
                .claim("role", member.getRole())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(key)
                .compact();
    }

    private String generateRefreshTokenWithMinimalInfo(String email, long expiration) {
        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(key)
                .compact();
    }

    public boolean isTokenExpired(String token) {
        try {
            extractExpiration(token);
            return false;
        } catch (ExpiredJwtException e) {
            return true;
        }
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).getBody();
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public long getRefreshTokenExpiration() {
        return refreshTokenExpiration;
    }

    public Long extractUserIdFromPrincipal(UserDetails userDetails) {
        return memberRepository.findByEmail(userDetails.getUsername())
                .map(Member::getId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + userDetails.getUsername()));
    }


}
