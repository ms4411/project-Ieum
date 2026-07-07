package com.example.backend.member;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class Member {
    @Id
    @NotNull
    @Column(unique = true, nullable = false)
    final UUID id = UUID.randomUUID();

    @NotBlank
    @Column(unique = true, nullable = false)
    String name;

    @NotBlank
    @Column(nullable = false)
    String pw;
}
