package com.example.backend.DTO.requestDTO;

import java.util.UUID;

public record UpdateGroupDTO(
        UUID groupId,
        String title,
        String content,
        int maxMember
) {
}
