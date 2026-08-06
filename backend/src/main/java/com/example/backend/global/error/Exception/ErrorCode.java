package com.example.backend.global.error.Exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum ErrorCode {
    HOST_CANNOT_REQUEST("모임장은 자신의 모임에 참여 신청이 불가", HttpStatus.FORBIDDEN),
    GROUP_FULL("정원이 가득 참", HttpStatus.CONFLICT),
    ALREADY_REQUESTED("이미 신청한 모임",HttpStatus.CONFLICT),
    ALREADY_MEMBER("이미 참여된 모임",HttpStatus.CONFLICT),
    RESERVATION_NOT_FOUND("해당하는 신청 없음", HttpStatus.NOT_FOUND),
    INVALID_REQUEST("유효하지 않은 요청", HttpStatus.CONFLICT),
    SMALL_CURRENT_THEN_MAX("현재 참여한 사람보다 더 최대참여자를 적게 설정함",HttpStatus.CONFLICT),
    ALREADY_PROCESSED("이미 처리된 요청", HttpStatus.CONFLICT),

    GROUP_NOT_FOUND("해당하는 그룹이 없음", HttpStatus.NOT_FOUND),

    USER_NOT_FOUND("해당하는 유저가 없음", HttpStatus.NOT_FOUND),
    LOGIN_FAILED("로그인 실패", HttpStatus.UNAUTHORIZED),
    PASSWORD_NOT_EQUALS("비밀번호 불일치", HttpStatus.BAD_REQUEST),
    LOGIN_ID_OVERLAP("로그인 아이디 중복",HttpStatus.CONFLICT);

    private final String message;
    private final HttpStatus code;
}
