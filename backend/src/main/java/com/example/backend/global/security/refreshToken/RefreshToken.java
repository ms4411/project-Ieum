package com.example.backend.global.security.refreshToken;

import jakarta.persistence.Id;
import lombok.*;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.index.Indexed;

@Getter
@NoArgsConstructor
@RequiredArgsConstructor
@RedisHash(value = "refreshToken", timeToLive = 14 * 24 * 60 * 60)
public class RefreshToken {
    @Id
    @NonNull
    private String id;

    @Indexed
    @NonNull
    private String token;  // 실제 리프레쉬 토큰 값
}
