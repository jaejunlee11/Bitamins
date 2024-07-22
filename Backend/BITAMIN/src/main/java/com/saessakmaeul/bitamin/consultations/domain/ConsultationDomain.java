package com.saessakmaeul.bitamin.consultations.domain;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "consultaiton")
public class ConsultationDomain {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column
    private Long id;

    @Column
    private String category;

    @Column
    private String title;

    @Column(name = "is_privated")
    private int isPrivated;

    @Column
    private String password;

    @Column(name = "start_time")
    private LocalDateTime startTime;

    @Column(name = "end_time")
    private LocalDateTime endTime;

    @Column(name = "current_participants")
    private int currentParticipants;

}
