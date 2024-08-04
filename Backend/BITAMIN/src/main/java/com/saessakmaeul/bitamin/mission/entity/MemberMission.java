package com.saessakmaeul.bitamin.mission.entity;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import java.util.Date;

public class MemberMission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private long id;

    @Column(name = "complete_date", nullable = false)
    private Date completeDate;

    @Column(name = "mission_key")
    private String missionKey;

    @Column(name = "mission_url")
    private String missionUrl;

    @Column(name = "mission_review")
    private String missionReview;

    @Column(name = "mission_id", nullable = false)
    private int missionId;

    @Column(name = "user_id", nullable = false)
    private long userId;

}