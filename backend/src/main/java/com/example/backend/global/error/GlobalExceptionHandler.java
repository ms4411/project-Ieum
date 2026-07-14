package com.example.backend.global.error;

import com.example.backend.DTO.ResponseOneDTO;
import com.example.backend.global.ResponseClass;
import com.example.backend.global.error.Exception.LoginException;
import com.example.backend.global.error.Exception.TokenException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;


@RestControllerAdvice
@RequiredArgsConstructor
public class GlobalExceptionHandler {
    final private ResponseClass responseClass;

    @ExceptionHandler(TokenException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public TokenException handleToken(TokenException e){
        return e;
    }

    @ExceptionHandler(LoginException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseOneDTO<String> handleLoginFalse(LoginException e){
        return responseClass.massageReturn("로그인 실패");
    }

    // 프로젝트 어디서든 IllegalArgumentException이 throw되면 이 메서드가 낚아챕니다.
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleIllegalArgument(IllegalArgumentException e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
    }
}