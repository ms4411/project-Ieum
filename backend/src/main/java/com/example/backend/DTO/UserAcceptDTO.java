package com.example.backend.DTO;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserAcceptDTO {
    @NotBlank
    String name;
    @NotBlank
    String pw;
}
