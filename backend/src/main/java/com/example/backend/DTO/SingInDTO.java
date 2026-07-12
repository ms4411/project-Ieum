package com.example.backend.DTO;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

@Getter
public class SingInDTO {
    @NotBlank
    String name;
    @NotBlank
    String pw;
    @NotBlank
    String checkPw;
}
