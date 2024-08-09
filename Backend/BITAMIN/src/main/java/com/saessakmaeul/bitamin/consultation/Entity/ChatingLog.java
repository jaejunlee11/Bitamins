package com.saessakmaeul.bitamin.consultation.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "chating_log")
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ChatingLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column
    private Long id;

    @Column
    private String content;

    @Column(name = "send_time", insertable = false)
    private LocalDateTime sendTime;

    @Column(name = "member_id")
    private Long memberId;

    @Column(name = "consultation_id")
    private Long consultationId;

    @Column(name = "member_nickname")
    private String memberNickname;
}
