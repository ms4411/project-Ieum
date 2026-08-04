package com.example.backend.global.error.Exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum ErrorCode {
    LOGIN_FAILED("로그인 실패", HttpStatus.UNAUTHORIZED),
    PASSWORD_NOT_EQUALS("비밀번호 불일치", HttpStatus.BAD_REQUEST),
    LOGIN_ID_OVERLAP("로그인 아이디 중복",HttpStatus.CONFLICT);

    private final String message;
    private final HttpStatus code;
}
