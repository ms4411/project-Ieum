package com.example.backend.DTO;

import lombok.AllArgsConstructor;

@AllArgsConstructor
public class ResponseOneDTO<dto> {
    Boolean success;
    String message;
    dto data;
}
