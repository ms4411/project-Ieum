package com.example.backend.domain.reservation.controller.dto.response;

import lombok.Builder;

import java.time.LocalDateTime;
import java.util.UUID;

@Builder
public record ReadGroupMembersDTO(
        UUID userId,
        String userNickname,

        LocalDateTime joinAt
){
}
