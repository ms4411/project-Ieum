package com.example.backend.domain.group.repository;

import com.example.backend.domain.group.Group;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface GroupRepository extends JpaRepository<Group, UUID> {
    List<Group> findAllByCreateUserId (UUID CreateUserId);

    boolean existsByCreateUser_Id(UUID createUserId);
    @Modifying(clearAutomatically = true)
    @Query("UPDATE Group g SET g.maxPeople = :newMaxPeople " +
            "WHERE g.id = :id AND g.currentMemberCount <= :newMaxPeople")
    int changeMaxPeople(@Param("id") UUID id, @Param("newMaxPeople") int newMaxPeople);

    void deleteAllByMeetAtBefore(LocalDateTime meetAtBefore);
}
