package com.example.backend.global.security;

import com.example.backend.DTO.ResponseDTO;
import com.example.backend.global.ResponseClass;
import com.example.backend.global.error.Exception.ErrorCode;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import tools.jackson.databind.ObjectMapper;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtExceptionFilter extends OncePerRequestFilter {
    private final ObjectMapper objectMapper;

    @Override
    public void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    )throws ServletException, IOException {
        try {
            filterChain.doFilter(request, response);
        } catch (io.jsonwebtoken.security.SecurityException | MalformedJwtException e) {
            SetErrorResponse(response, ErrorCode.SIGNATURE_EXCEPTION);
        } catch (ExpiredJwtException e) {
            SetErrorResponse(response, ErrorCode.EXPIRED_TOKEN);
        } catch (UnsupportedJwtException e) {
            SetErrorResponse(response, ErrorCode.UNSUPPORTED);
        } catch (IllegalArgumentException e) {
            SetErrorResponse(response, ErrorCode.WRONG_TOKEN);
        }
    }
    private void SetErrorResponse(HttpServletResponse response, ErrorCode code) throws IOException{
        ResponseDTO.errorRes errorResponse=ResponseDTO.errorRes.builder()
                .code(code.getCode())
                .message(code.getMessage())
                .build();
        objectMapper.writeValue(response.getWriter(), errorResponse);
    }
}
