package com.saessakmaeul.bitamin.consultations.repository;

import com.saessakmaeul.bitamin.consultations.Entity.Consultation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ConsultationRepository extends JpaRepository<Consultation, Long> {
    Page<Consultation> findByIsPrivated(int isPrivated, Pageable pageable);
    Page<Consultation> findByCategory(String category, Pageable pageable);
    Consultation findByCurrentParticipantsLessThanEqualOrderByRand(int currentParticipant);
    Consultation findByCategoryAndCurrentParticipantsLessThanEqualOrderByRand(String category, int currentParticipant);
}
