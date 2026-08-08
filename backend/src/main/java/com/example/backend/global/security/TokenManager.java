package com.example.backend.global.security;

import com.example.backend.DTO.responseDTO.TokensDTO;
import com.example.backend.global.error.Exception.CustomException;
import com.example.backend.global.error.Exception.ErrorCode;
import com.example.backend.global.security.refreshToken.RefreshToken;
import com.example.backend.global.security.refreshToken.RefreshTokenRepository;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.codec.Hex;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.*;
import java.util.stream.Collectors;

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


    public String hashToken(String refreshToken) {
        try {
            //자바 scanner 해싱 버전
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            //utf-8방식으로 byte[]배열 얻은 것으로 해싱
            byte[] hash = digest.digest(refreshToken.getBytes(StandardCharsets.UTF_8));

            // Byte 배열을 16진수 문자열로 변환
            // byte[]를 char[]로 변환 후 String 생성
            return new String(Hex.encode(hash));
        }catch (NoSuchAlgorithmException e){
            throw new CustomException(ErrorCode.NO_SUCH_ALGORITHM);
        }
    }

    private String createAcceptToken(String id, Map<String, Object> tokenContent){
        Date now = new Date();
        Date expirationTime = new Date(now.getTime()+VALID_TIME);
        if (id==null || id.isEmpty()){
            id= UUID.randomUUID().toString();
        }
        Map<String, Object> data=new HashMap<>(tokenContent);
        data.computeIfPresent("role", (k, v) -> v + ",ROLE_LOGIN");
        if (!data.containsKey("role")) {
            data.put("role","ROLE_LOGIN");
        }
        return Jwts.builder() //토큰 발행
                .subject(id)
                .issuedAt(now)
                .expiration(expirationTime)
                .claims(data)
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
        refreshTokenRepository.save(
                RefreshToken.builder()
                        .sub(id)
                        .token(hashToken(refreshToken))
                        .expiredDate(expirationTime)
                        .build()
        );
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
            }else{
                throw new CustomException(ErrorCode.BAD_REQUEST);
            }
            // 토큰 서명을 검증하고 내부 데이터(Claims)를 파싱
            // 만료되었거나 누군가 1글자라도 위조했다면 예외(Exception)가 발생.
            return Jwts.parser()
                    //해독기 객체 생성
                    .verifyWith(SECRET_KEY)
                    .build()
                    .parseSignedClaims(token) //서명 및 만료기간 인증. 데이터 복호화
                    .getPayload(); //토큰에서 페이로드만 반환


        } catch (io.jsonwebtoken.security.SecurityException | MalformedJwtException e) {
            throw new CustomException(ErrorCode.SIGNATURE_EXCEPTION);
        } catch (ExpiredJwtException e) {
            throw new CustomException(ErrorCode.EXPIRED_TOKEN);
        } catch (UnsupportedJwtException e) {
            throw new CustomException(ErrorCode.UNSUPPORTED);
        } catch (IllegalArgumentException e) {
            throw new CustomException(ErrorCode.WRONG_TOKEN);
        }
    }

    public Claims expiredTokenGetPayload(String token){
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
        }

        try {
            return Jwts.parser()
                    .verifyWith(SECRET_KEY)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
        } catch (ExpiredJwtException e) {
            return e.getClaims();
        }
    }

    public String getSubject(String token){
        Claims payload=getToken(token);
        return payload.getSubject();
    }
    public UUID getCreatGroupId(String token){
        Claims payload=getToken(token);
        if (!(payload.containsKey("createGroupId"))){
            return null;
        }
        return UUID.fromString(
                String.valueOf(
                        payload.get("createGroupId")
                )
        );
    }
    //---------------------------------------------filter를 위한 메서드

    // ----------------------------------------------------------------
    // 1. JWT 토큰 유효성 검증
    // ----------------------------------------------------------------
    public boolean validateToken(String token) {
        try {
            // 토큰 파싱 시도 (비밀키로 서명 검증 및 만료 시간 확인)
            Jwts.parser().verifyWith(SECRET_KEY).build().parseSignedClaims(token);
            return true;
        } catch (io.jsonwebtoken.security.SecurityException | MalformedJwtException e) {
            throw new CustomException(ErrorCode.SIGNATURE_EXCEPTION);
        } catch (ExpiredJwtException e) {
            throw new CustomException(ErrorCode.EXPIRED_TOKEN);
        } catch (UnsupportedJwtException e) {
            throw new CustomException(ErrorCode.UNSUPPORTED);
        } catch (IllegalArgumentException e) {
            throw new CustomException(ErrorCode.WRONG_TOKEN);
        }
    }
    // ----------------------------------------------------------------
    // 2. JWT 토큰에서 Authentication 객체 추출
    // ----------------------------------------------------------------
    private static final String AUTHORITIES_KEY = "role";
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
