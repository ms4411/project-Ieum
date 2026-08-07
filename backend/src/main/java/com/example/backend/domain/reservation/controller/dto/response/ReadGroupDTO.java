package com.example.backend.domain.reservation.controller.dto.response;

import com.example.backend.domain.reservation.RoleEnum;
import lombok.Builder;

import java.util.List;
import java.util.UUID;

@Builder
public record ReadGroupDTO(
    UUID id,
    String title,
    String content,
    RoleEnum role,
    List<ReadGroupMembersDTO> members
) {
}
