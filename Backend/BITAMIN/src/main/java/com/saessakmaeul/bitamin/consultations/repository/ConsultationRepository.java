package com.saessakmaeul.bitamin.consultations.repository;

import com.saessakmaeul.bitamin.consultations.Entity.Consultation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ConsultationRepository extends JpaRepository<Consultation, Long> {
    Page<Consultation> findByIsPrivated(int isPrivated, Pageable pageable);
    Page<Consultation> findByCategory(String category, Pageable pageable);
    @Query(value = "SELECT * FROM Consultation WHERE currentParticipants <= ?1 ORDER BY RAND() LIMIT 1", nativeQuery = true)
    Consultation findByCurrentParticipantsLessThanEqualOrderByRand(int currentParticipant);
    @Query(value = "SELECT * FROM Consultation WHERE category = ?1 AND currentParticipants <= ?2 ORDER BY RAND() LIMIT 1", nativeQuery = true)
    Consultation findByCategoryAndCurrentParticipantsLessThanEqualOrderByRand(String category, int currentParticipant);
}
