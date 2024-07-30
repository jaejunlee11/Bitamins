package com.saessakmaeul.bitamin.consultations.repository;

import com.saessakmaeul.bitamin.consultations.Entity.Consultation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ConsultationRepository extends JpaRepository<Consultation, Long> {
    Page<Consultation> findByCurrentParticipantsGreaterThan(int currentParticipants, Pageable pageable);
    Page<Consultation> findByIsPrivatedAndCurrentParticipantsGreaterThan(boolean isPrivated, int currentParticipants, Pageable pageable);
    Page<Consultation> findByCategoryAndCurrentParticipantsGreaterThan(String category, int currentParticipants, Pageable pageable);

    @Query(value = "SELECT * " +
            "FROM consultation " +
            "WHERE current_participants <= ?1 " +
            "ORDER BY RAND() " +
            "LIMIT 1 ",
            nativeQuery = true)
    Optional<Consultation> findByCurrentParticipantsLessThanEqualOrderByRand(int currentParticipant);

    @Query(value = "SELECT * " +
            "FROM consultation "+
            "WHERE category = ?1 " +
            "AND current_participants <= ?2 " +
            "ORDER BY RAND() " +
            "LIMIT 1 ",
            nativeQuery = true)
    Optional<Consultation> findByCategoryAndCurrentParticipantsLessThanEqualOrderByRand(String category, int currentParticipant);

    @Query(value = "SELECT id " +
            "FROM consultation " +
            "WHERE current_participants = 0 " +
            "AND start_time < NOW() - INTERVAL 15 DAY ",
            nativeQuery = true)
    List<Long> findIdsOfOldConsultations();
}
