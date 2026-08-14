package com.example.backend.global.security;

import com.example.backend.global.security.filter.JwtExceptionFilter;
import com.example.backend.global.security.filter.TokenFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {
    private final TokenFilter tokenFilter;
    private final JwtExceptionFilter jwtExceptionFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http){
        http
                .cors(cors->cors.configurationSource(corsConfigurationSource()))
                .csrf(AbstractHttpConfigurer::disable) // REST API 환경에서는 보통 CSRF disable
                .addFilterBefore(tokenFilter, UsernamePasswordAuthenticationFilter.class)
                .addFilterBefore(jwtExceptionFilter, TokenFilter.class)
                .authorizeHttpRequests(auth -> auth
                        // 특정 경로 인증 없이 허용
                        //.requestMatchers(
                        //        "/api/v1/users",
                        //        "/api/v1/auth/login",
                        //        "/api/v1/auth/signUp"
                        //).permitAll()
                        .requestMatchers("/h2-console/**").permitAll()
                        .anyRequest().permitAll()
                        //.anyRequest().authenticated()
                )
                .headers(headers -> headers
                        .frameOptions(HeadersConfigurer.FrameOptionsConfig::sameOrigin) // H2 콘솔 Frame 표시 허용
                );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        config.addAllowedOrigin("http://localhost:5174"); // 허용할 프론트엔드 주소
        config.addAllowedOrigin("https://project-ieum-frontend.onrender.com"); // 허용할 프론트엔드 주소
        config.addAllowedMethod("*");                     // GET, POST, PUT, DELETE 등 허용
        config.addAllowedHeader("*");                     // 모든 헤더 허용
        config.setAllowCredentials(true);                 // 쿠키/인증 헤더 허용
        config.setMaxAge(3600L);                          // Preflight 캐싱 시간(초)

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() { //비밀번호 암호화
        return new BCryptPasswordEncoder();
    }
}
