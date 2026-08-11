package com.example.backend.DTO.requestDTO;

import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;

public record CreateGroupDTO (
        String content,
        String title,
        MultipartFile imgFile,
        int maxMemberCnt,
        Double lat,
        Double lng,
        String address,
        LocalDateTime meetAt
){
}
