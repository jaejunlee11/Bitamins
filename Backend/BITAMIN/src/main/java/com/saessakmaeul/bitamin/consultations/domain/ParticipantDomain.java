package com.saessakmaeul.bitamin.consultations.domain;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "participant")
public class ParticipantDomain {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column
    private Long id;

    @Column(name = "member_id")
    private Long memberId;

    @Column(name = "member_nickname")
    private String memberNickname;

    @Column(name = "consultation_id")
    private Long consultationId;

    @Column(name = "consultation_date")
    private LocalDate consultationDate;
}
