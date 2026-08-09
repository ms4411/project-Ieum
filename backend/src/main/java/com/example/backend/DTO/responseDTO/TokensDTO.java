package com.example.backend.DTO.responseDTO;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class TokensDTO {
    String refreshToken;
    String accessToken;
}
