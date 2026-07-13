package com.example.backend.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class ResponseOneDTO<dto> {
    Boolean success;
    String message;
    dto data;
}
