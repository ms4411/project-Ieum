package com.example.backend.group;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;

import java.util.UUID;

@Entity
@RequiredArgsConstructor
@NoArgsConstructor
public class Group {
    @Id
    UUID id;
    @NonNull
    @NotBlank
    String head;
    @NonNull
    @NotBlank
    String content;
    @NonNull
    @NotNull
    Long lat;
    @NonNull
    @NotNull
    Long lng;
    @NonNull
    @NotNull
    Long maxPeople;

}
