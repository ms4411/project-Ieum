package com.example.backend.global.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.Map;
import java.util.UUID;

//id는 subject에 저장
//role는 역할이나 권한


@Component
public class TokenManager {
    @Value("${jwt.secret-key}")
    private String SECRET_KEY_STRING; //보안 키

    private SecretKey SECRET_KEY;

    final static private Long VALID_TIME= 30 * 60 * 1000L; //토큰 허용 시간(30분)

    @PostConstruct //Value 후 자동 실행
    public void init() {
        SECRET_KEY = Keys.hmacShaKeyFor(SECRET_KEY_STRING.getBytes(StandardCharsets.UTF_8)); //암호화
    }
    public String createToken(String id, Map<String, Object> tokenContent){
        Date now = new Date();
        Date expirationTime = new Date(now.getTime()+VALID_TIME);
        if (id==null || id.isEmpty()){
            id= UUID.randomUUID().toString();
        }
        return Jwts.builder() //토큰 발행
                .subject(id)
                .issuedAt(now)
                .expiration(expirationTime)
                .claims(tokenContent)
                .signWith(SECRET_KEY)
                .compact();

    }
    public Claims getToken(String token){
        try {
            // Bearer 접두사 제거
            if (token != null && token.startsWith("Bearer ")) {
                token = token.substring(7);
            }

            // 토큰 서명을 검증하고 내부 데이터(Claims)를 파싱
            // 만료되었거나 누군가 1글자라도 위조했다면 예외(Exception)가 발생.
            return Jwts.parser()
                    //해독기 객체 생성
                    .verifyWith(SECRET_KEY)
                    .build()
                    .parseSignedClaims(token) //서명 및 만료기간 인증. 데이터 복호화
                    .getPayload(); //토큰에서 페이로드만 반환

        } catch (Exception e) {
            // 토큰 만료, 서명 불일치, 올바르지 않은 구조 등 모든 검증 실패 시 null 반환
            throw new IllegalArgumentException("토큰에서 에러 발생");
        }
    }
}
