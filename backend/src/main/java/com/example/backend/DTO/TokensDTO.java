package com.example.backend.DTO;

import lombok.AllArgsConstructor;
import org.springframework.http.ResponseCookie;

@AllArgsConstructor
public class TokensDTO {
    String refreshToken;
    String acceptToken;
}
