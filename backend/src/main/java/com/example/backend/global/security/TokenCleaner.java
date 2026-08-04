package com.example.backend.global.security;

import com.example.backend.global.security.refreshToken.RefreshTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Date;

@Component
@EnableScheduling
@RequiredArgsConstructor
public class TokenCleaner {

    private final RefreshTokenRepository refreshTokenRepository;

    // 매일 새벽 3시마다 만료된 토큰 자동 삭제
    @Scheduled(cron = "0 0 3 * * ?")
    @Transactional
    public void cleanExpiredTokens() {
        refreshTokenRepository.deleteByExpiredDateBefore(new Date());
    }
}