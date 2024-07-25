package com.saessakmaeul.bitamin.message.entity;

import jakarta.persistence.*;
import lombok.Getter;

import java.time.LocalDate;

@Entity
@Table(name = "message")
@Getter
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private long id;

    @Column(name = "sender_id")
    private long senderId;

    @Column(name = "reciever_id")
    private long recieverId;

    @Column(name = "category")
    private String category;

    @Column(name = "title")
    private String title;

    @Column(name = "content")
    private String content;

    @Column(name = "send_date")
    private LocalDate sendDate;

    @Column(name= "counseling_date")
    private LocalDate counselingDate;

    @Column(name = "is_read")
    private Boolean isRead;

    @Column(name = "is_deleted")
    private int isDeleted;
}
