package com.saessakmaeul.bitamin.consultations.Entity;

import jakarta.persistence.*;
import lombok.Getter;

import java.time.LocalDate;

@Entity
@Getter
@Table(name = "participant")
public class Participant {
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
