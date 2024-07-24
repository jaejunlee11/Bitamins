package com.saessakmaeul.bitamin.consultations.dto.response;

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
public class JoinRandomResponse {
    private Long id;
    private String category;
    private String title;
    private boolean isPrivated;
    private String password;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private int currentParticipants;

    List<ParticipantResponse> participants;
}
