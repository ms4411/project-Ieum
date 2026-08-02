package com.example.backend.global.security;

import com.example.backend.DTO.TokensDTO;
import com.example.backend.global.error.Exception.TokenException;
import com.example.backend.global.security.refreshToken.RefreshToken;
import com.example.backend.global.security.refreshToken.RefreshTokenRepository;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.stream.Collectors;

import static com.example.backend.global.security.TokenFilter.AUTHORIZATION_HEADER;
import static com.example.backend.global.security.TokenFilter.BEARER_PREFIX;

//id는 subject에 저장
//role는 역할이나 권한


@Component
public class TokenManager {
    private final String SECRET_KEY_STRING; //보안 키
    private SecretKey SECRET_KEY;
    final private RefreshTokenRepository refreshTokenRepository;

    final static private Long VALID_TIME= 5 * 60 * 1000L; //토큰 허용 시간(5분)
    final static private Long REFRESH_VALID_TIME= 14 * 24 * 60 * 60 * 1000L;

    public TokenManager(TokenProperties tokenProperties, RefreshTokenRepository refreshTokenRepository){
        this.SECRET_KEY_STRING=tokenProperties.secretKey();
        this.SECRET_KEY = Keys.hmacShaKeyFor(SECRET_KEY_STRING.getBytes(StandardCharsets.UTF_8)); //암호화
        this.refreshTokenRepository=refreshTokenRepository;
    }

    private String createAcceptToken(String id, Map<String, Object> tokenContent){
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
    private String createRefreshToken(String id){
        Date now = new Date();
        Date expirationTime = new Date(now.getTime()+REFRESH_VALID_TIME);
        String refreshToken = Jwts.builder()
                .subject(id)
                .issuedAt(now)
                .expiration(expirationTime)
                .signWith(SECRET_KEY)
                .compact();
        refreshTokenRepository.save(new RefreshToken(id, refreshToken));
        return refreshToken;
    }

    public TokensDTO createTokens(String id, Map<String, Object> tokenContent){
        String acceptToken=createAcceptToken(id, tokenContent);
        String refreshToken=createRefreshToken(id);
        return new TokensDTO(refreshToken, acceptToken);
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

        } catch (ExpiredJwtException e){
            throw new TokenException("토큰이 만료되었습니다.", true);
        }catch (Exception e) {
            // 토큰 만료, 서명 불일치, 올바르지 않은 구조 등 모든 검증 실패 시 null 반환
            throw new TokenException("유효 토큰이 아닙니다.");
        }
    }
    public String getSubject(String token){
        Claims payload=getToken(token);
        return payload.getSubject();
    }
    //---------------------------------------------filter를 위한 메서드

    // ----------------------------------------------------------------
    // 1. JWT 토큰 유효성 검증
    // ----------------------------------------------------------------
    public boolean validateToken(String token) {
        try {
            // 토큰 파싱 시도 (비밀키로 서명 검증 및 만료 시간 확인)
            Jwts.parser().setSigningKey(SECRET_KEY).build().parseClaimsJws(token);
            return true;
        } catch (io.jsonwebtoken.security.SecurityException | MalformedJwtException e) {
            throw new TokenException("잘못된 JWT 서명입니다.");
        } catch (ExpiredJwtException e) {
            throw new TokenException("만료된 JWT 토큰입니다.", true);
        } catch (UnsupportedJwtException e) {
            throw new TokenException("지원되지 않는 JWT 토큰입니다.");
        } catch (IllegalArgumentException e) {
            throw new TokenException("JWT 토큰이 잘못되었습니다.");
        }
    }
    // ----------------------------------------------------------------
    // 2. JWT 토큰에서 Authentication 객체 추출
    // ----------------------------------------------------------------
    private static final String AUTHORITIES_KEY = "rols";
    public Authentication getAuthentication(String accessToken) {
        // 토큰 복호화하여 내부 Claim 추출
        Claims claims = getToken(accessToken);

        if (claims.get(AUTHORITIES_KEY) == null) {
            throw new RuntimeException("권한 정보가 없는 토큰입니다.");
        }

        // 클레임에서 권한 정보 가져오기 (예: "ROLE_USER,ROLE_ADMIN")
        //SimpleGrantedAuthority으로 이루어진 리스트(authorities)에 저장
        Collection<? extends GrantedAuthority> authorities =
                Arrays.stream(claims.get(AUTHORITIES_KEY).toString().split(","))
                        .map(SimpleGrantedAuthority::new)
                        .collect(Collectors.toList());

        // UserDetails 객체를 만들어 Authentication 리턴
        //(DB 조회 없이 토큰 정보만으로 생성)
        //UserDetails : 스프링 시큐리티에서 "사용자 정보"를 다루기 위한 표준 규격
        //(인터페이스)
        UserDetails principal = new User(claims.getSubject(), "", authorities);

        //UsernamePasswordAuthenticationToken: Authentication를 구현한 실체 클래스
        return new UsernamePasswordAuthenticationToken(principal, "", authorities);
    }
}
