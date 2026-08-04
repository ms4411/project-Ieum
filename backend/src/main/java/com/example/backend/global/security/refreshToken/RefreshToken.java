package com.example.backend.global.security.refreshToken;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.Date;


@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RefreshToken {
    @Id
    @Column(nullable = false, unique = true, updatable = false)
    private String sub;

    @Column(nullable = false)
    private String token;  // 실제 리프레쉬 토큰 값

    @Column(nullable = false)
    Date expiredDate;
}
