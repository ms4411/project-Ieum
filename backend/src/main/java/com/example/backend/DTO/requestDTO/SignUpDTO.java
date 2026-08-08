package com.example.backend.DTO.requestDTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;

@Getter
public class SignUpDTO {
    @NotBlank
    String loginId;
    @NotBlank
    @Size(min = 8, message = "최소 8글자 이상 입력")
    String pw;
    @NotBlank
    String checkPw;
    @NotBlank
    String nickname;
}
