package com.example.backend.group;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;

import java.util.UUID;

@Entity
@NoArgsConstructor
@AllArgsConstructor
public class Group {
    @Id
    final UUID id=UUID.randomUUID();
    @Column(nullable = false)
    String head;
    @Column(nullable = false)
    String content;
    @Column(nullable = false)
    Long lat;
    @Column(nullable = false)
    Long lng;
    @Column(nullable = false)
    Long maxPeople;

    @Column(nullable = false)
    UUID createUserId;
}
