package com.example.backend.domain.reservation;

import com.example.backend.domain.group.Group;
import com.example.backend.domain.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    boolean existsByUserAndGroup(User user, Group group);
    Optional<Reservation> findByUserAndGroup(User user, Group group);
    Optional<Reservation> findByUser_IdAndGroup_Id(UUID userId, UUID groupId);
    List<Reservation> findByGroup_IdAndStatus(UUID id, ReservationStatus status);
    Optional<Reservation> findByIdAndGroup_Id(Long id, UUID groupId);
    List<Reservation> findByUser_IdAndStatus(UUID userId, ReservationStatus status);
}
