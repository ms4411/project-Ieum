package com.example.backend.global;

import com.example.backend.DTO.ResponseDTO;
import com.example.backend.DTO.ResponseOneDTO;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

import java.util.List;

@NoArgsConstructor
@Component
public class ResponseClass {
    public ResponseDTO<?> successReturn(String message, List<?> data){
        return new ResponseDTO<>(true, message, data);
    }

    public ResponseOneDTO<String> massageReturn(String massage){
        return new ResponseOneDTO<String>(true, "메세지 반환", massage);
    }

    public ResponseEntity<?> responseCookie(String domain, String path, Boolean httpOnly){
        ResponseCookie cookie = ResponseCookie.from("myCookie", "cookieValue")
                .domain(domain)           // 쿠키가 유효한 도메인 설정
                .path(path)                     // 모든 경로에서 쿠키 접근 가능
                .httpOnly(httpOnly)                // 자바스크립트 접근 방지 (XSS 예방)
                .secure(true)                  // HTTPS 환경에서만 전송
                .maxAge(7 * 24 * 60 * 60)      // 쿠키 유효 기간 (7일, 초 단위)
                .sameSite("Lax")               // CSRF 공격 방어 설정 (Lax, Strict, None)
                .build();
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body("쿠키 반환");
    }
}
