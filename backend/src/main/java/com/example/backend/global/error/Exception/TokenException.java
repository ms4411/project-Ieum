package com.example.backend.global.error.Exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@AllArgsConstructor
@Getter
public class TokenException extends RuntimeException{
    final private String massage;
    private boolean expired=false;
}
