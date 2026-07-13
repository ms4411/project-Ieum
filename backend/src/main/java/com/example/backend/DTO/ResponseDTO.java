package com.example.backend.DTO;

import lombok.AllArgsConstructor;

import java.util.List;

@AllArgsConstructor
public class ResponseDTO<dto> {
    Boolean success;
    String message;
    List<dto> data;
}
