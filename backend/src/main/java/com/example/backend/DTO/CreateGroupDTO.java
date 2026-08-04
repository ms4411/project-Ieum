package com.example.backend.DTO;

import java.time.LocalDateTime;

public record CreateGroupDTO (
        String content,
        String title,
        String imgUrl,
        int maxMemberCnt,
        int lat,
        int lng,
        String address,
        LocalDateTime meatAt
){
}
