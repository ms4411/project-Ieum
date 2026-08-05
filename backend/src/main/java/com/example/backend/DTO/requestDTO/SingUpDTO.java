package com.example.backend.DTO.requestDTO;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

@Getter
public class SingUpDTO {
    @NotBlank
    String loginId;
    @NotBlank
    String pw;
    @NotBlank
    String checkPw;
    @NotBlank
    String nickname;
}
