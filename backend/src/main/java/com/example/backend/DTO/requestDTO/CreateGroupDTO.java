package com.example.backend.DTO.requestDTO;

import java.time.LocalDateTime;

public record CreateGroupDTO (
        String content,
        String title,
        String imgUrl,
        int maxMemberCnt,
        Double lat,
        Double lng,
        String address,
        LocalDateTime meatAt
){
}
