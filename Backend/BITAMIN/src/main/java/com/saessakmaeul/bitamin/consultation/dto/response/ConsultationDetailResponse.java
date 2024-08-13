package com.saessakmaeul.bitamin.consultation.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
public class ConsultationDetailResponse {
    private Long id;
    private String category;
    private String title;
    private Boolean isPrivated;
    private String password;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private int currentParticipants;

    private List<ParticipantResponse> participants;
}
