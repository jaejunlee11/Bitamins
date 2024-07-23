package com.saessakmaeul.bitamin.token;

import com.saessakmaeul.bitamin.member.entity.Member;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Date;

@Getter
@Setter
@Builder
@AllArgsConstructor
@Entity
@Table(name = "refresh_token")
public class RefreshToken {
    @Id
    private Long id;

    @OneToOne
    @MapsId
    @JoinColumn(name = "id")
    private Member member;

    @Column(name = "refresh_token", nullable = false)
    private String refreshToken;

    @Column(name = "expiry_date", nullable = false)
    private LocalDateTime expireDate;

    public RefreshToken() {

    }
}
