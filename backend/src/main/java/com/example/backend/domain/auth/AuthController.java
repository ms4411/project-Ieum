package com.example.backend.domain.auth;

import com.example.backend.DTO.ResponseDTO;
import com.example.backend.DTO.requestDTO.SingInDTO;
import com.example.backend.DTO.requestDTO.SingUpDTO;
import com.example.backend.global.ResponseClass;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RequiredArgsConstructor
@RequestMapping("/api/v1/auth")
@RestController
public class AuthController {
    private final ResponseClass responseClass;
    private final AuthService authService;

    @PostMapping("/signUp")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseDTO.successRes singUp(@Valid @RequestBody SingUpDTO singUpDTO){
        return responseClass.messageReturn(
                authService.signUp(
                        singUpDTO.getLoginId(), singUpDTO.getNickname(), singUpDTO.getPw(), singUpDTO.getCheckPw()
                )
        );
    }

    @PostMapping("/login")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseDTO.successRes signUp(@Valid @RequestBody SingInDTO singInDTO){
        return ResponseDTO.successRes.builder()
                .data(
                        Map.of(
                                "tokens",
                                authService.signIn(
                                        singInDTO.getLoginId(),
                                        singInDTO.getPw()
                                )
                        )
                )
                .build();
    }

    @PostMapping("/logout")
    public ResponseDTO.successRes logout(@Header("Authorization") String token){
        return responseClass.messageReturn(authService.logout(token));
    }
}
