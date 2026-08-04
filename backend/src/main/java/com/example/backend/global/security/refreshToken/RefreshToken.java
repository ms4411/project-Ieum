package com.example.backend.global.security.refreshToken;

import jakarta.persistence.Column;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.index.Indexed;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@RedisHash(value = "refreshToken", timeToLive = 14 * 24 * 60 * 60)
public class RefreshToken {
    @Id
    @Column(nullable = false, unique = true, updatable = false)
    private String sub;

    @Indexed
    @Column(nullable = false)
    private String token;  // 실제 리프레쉬 토큰 값
}
