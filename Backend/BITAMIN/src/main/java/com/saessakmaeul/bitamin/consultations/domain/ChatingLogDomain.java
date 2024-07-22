package com.saessakmaeul.bitamin.consultations.domain;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "chating_log")
public class ChatingLogDomain {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column
    private Long id;

    @Column
    private String content;

    @Column(name = "send_time")
    private LocalDateTime sendTime;

    @Column(name = "member_id")
    private Long memberId;

    @Column(name = "consultation_id")
    private Long consultationId;

    @Column(name = "member_nickname")
    private String memberNickname;
}
