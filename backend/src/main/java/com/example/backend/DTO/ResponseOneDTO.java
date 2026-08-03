package com.example.backend.DTO;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;

@AllArgsConstructor
@Builder
public class ResponseOneDTO<dto> {
    Boolean success;
    String message;
    dto data;
}
