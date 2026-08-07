package com.example.backend.global.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils; //스프링의 문자열 유틸리티
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * 모든 HTTP 요청마다 한 번씩 실행, 헤더에서 JWT 토큰을 추출·검증하는 필터
 */
@RequiredArgsConstructor
@Component
public class TokenFilter extends OncePerRequestFilter {
//OncePerRequestFilter  = 각 요청당 한번만

    // HTTP 요청 헤더에서 인증 정보를 담을 헤더 이름
    public static final String AUTHORIZATION_HEADER = "Authorization";
    // 토큰 접두사 (Bearer 방식 사용)
    public static final String BEARER_PREFIX = "Bearer ";
    // JWT 토큰 생성, 검증 및 Authentication 객체 생성을 담당하는 컴포넌트
    private final TokenManager jwtTokenProvider;

    /**
     * 필터링 로직을 수행하는 핵심 메서드
     */
    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {
        // 1. 해더에서 토큰 추출. 없으면 null반환
        String jwt = resolveToken(request);


        // 2-1 토큰이 존재하고 유효성 검증을 통과한 경우에만 처리합니다.
        if (StringUtils.hasText(jwt) && jwtTokenProvider.validateToken(jwt)) {
            //StringUtils.hasText(String) = 문자열이 null과 ""이 아닌경우 true

            //2-2 토큰의 정보를 추출 후 시큐리티 내부 저장소에 저장
            // 토큰 내부 데이터(Claims)를 기반으로 Security용 Authentication 객체를 만듭니다.
            Authentication authentication = jwtTokenProvider.getAuthentication(jwt);
            // SecurityContextHolder에 Authentication 객체를 저장합니다.
            // 이 작업을 거치면 해당 요청(Request) 동안 컨트롤러 등에서 로그인된 사용자 정보를 조회할 수 있게 됩니다.
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }
        // 3. 다음 필터로 요청을 전달
        // 토큰이 없거나 유효하지 않아도 다음 필터로 넘어간 뒤, Spring Security 설정에 따라 접근 거부(401/403) 처리됩니다.
        filterChain.doFilter(request, response);
    }

    /**
     * Request Header에서 값을 가져와 접두사를 제거하고 토큰만 반환하는 메서드
     */
    private String resolveToken(HttpServletRequest request) {
        // Authorization: 토큰 형태의 문자열을 읽음
        String bearerToken = request.getHeader(AUTHORIZATION_HEADER);

        // 값에 내용이 있고, "Bearer "로 시작하는지 검증합니다.
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith(BEARER_PREFIX)) {
            // "Bearer " (7자) 이후의 토큰 값만 잘라내어 반환
            return bearerToken.substring(BEARER_PREFIX.length());
        }
        return null; // 헤더에 토큰이 없거나 잘못된 형식인 경우 null 반환
    }
}