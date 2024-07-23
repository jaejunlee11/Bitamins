package com.saessakmaeul.bitamin.consultations.service;

import com.saessakmaeul.bitamin.consultations.Entity.Consultation;
import com.saessakmaeul.bitamin.consultations.Entity.SerchCondition;
import com.saessakmaeul.bitamin.consultations.dto.response.SelectAllResponse;
import com.saessakmaeul.bitamin.consultations.repository.ConsultationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ConsultationService {
    private final ConsultationRepository consultationRepository;

    public List<SelectAllResponse> selectAll(int page, int size, SerchCondition type) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));
        Page<Consultation> consultationPage;

        System.out.println("Service");

        if(type == null || type == SerchCondition.전체 ) consultationPage = consultationRepository.findAll(pageable);

        else if(type == SerchCondition.비밀방) consultationPage = consultationRepository.findByIsPrivated(1, pageable);

        else consultationPage = consultationRepository.findByCategory(type.name(), pageable);

        List<SelectAllResponse> consultations = consultationPage.getContent().stream()
                .map(domain -> new SelectAllResponse(
                        domain.getId(),
                        domain.getCategory(),
                        domain.getTitle(),
                        domain.getIsPrivated(),
                        domain.getPassword(),
                        domain.getStartTime(),
                        domain.getEndTime(),
                        domain.getCurrentParticipants(),
                        page,
                        size,
                        consultationPage.getTotalElements(),
                        consultationPage.getTotalPages()
                ))
                .collect(Collectors.toList());

        return consultations;
    }
}
