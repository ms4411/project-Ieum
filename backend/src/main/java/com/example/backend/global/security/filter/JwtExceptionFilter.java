package com.example.backend.global.security.filter;

import com.example.backend.DTO.ResponseDTO;
import com.example.backend.global.error.Exception.CustomException;
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
        } catch (CustomException e) {
            SetErrorResponse(response, e);
        }
    }
    private void SetErrorResponse(HttpServletResponse response, CustomException e) throws IOException{
        ResponseDTO.errorRes errorResponse=ResponseDTO.errorRes.builder()
                .code(e.getErrorCode().getCode())
                .message(e.getErrorCode().getMessage())
                .build();
        objectMapper.writeValue(response.getWriter(), errorResponse);
    }
}
