package com.saessakmaeul.bitamin.consultations.dto.response;

import lombok.*;

import java.time.LocalDateTime;

@AllArgsConstructor
@Getter
public class SelectAllResponse {
    private Long id;
    private String category;
    private String title;
    private Boolean isPrivated;
    private String password;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private int currentParticipants;

    // 추가 페이징 정보
    private int page;
    private int size;
    private long totalElements;
    private int totalPages;
}
