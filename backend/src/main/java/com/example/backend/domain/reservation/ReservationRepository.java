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
    List<Reservation> findAllByGroup_IdAndStatus(UUID id, ReservationStatus status);
    Optional<Reservation> findByIdAndGroup_Id(Long id, UUID groupId);
    List<Reservation> findAllByUser_IdAndStatus(UUID userId, ReservationStatus status);

    List<Reservation> findAllByGroup_Id(UUID groupId);
    List<Reservation> findAllByRoleAndUser_Id(RoleEnum role, UUID userId);
    List<Reservation> findAllByUser_Id(UUID userId);
    List<Reservation> findAllByUser_IdAndRoleAndStatus(UUID userId, RoleEnum role, ReservationStatus status);
    
}
