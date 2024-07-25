package com.saessakmaeul.bitamin.message.entity;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "message")
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

    @Column(table = "send_date")
    private LocalDate sendDate;

    @Column(table = "counseling_date")
    private LocalDate counselingDate;

    @Column(table = "is_read")
    private boolean isRead;

    @Column(table = "is_deleted")
    private int isDeleted;
}
