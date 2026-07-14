package com.example.backend.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class TokensDTO {
    String refreshToken;
    String acceptToken;
}
