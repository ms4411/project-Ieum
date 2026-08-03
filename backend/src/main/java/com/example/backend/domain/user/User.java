package com.example.backend.domain.user;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class User {
    @Id
    @Column(unique = true, nullable = false)
    final UUID id = UUID.randomUUID();

    @Column(unique = true, nullable = false)
    String name;

    @Column(nullable = false)
    @Size(min = 8, message = "최소 8글자 이상 입력")
    String pw;
}
