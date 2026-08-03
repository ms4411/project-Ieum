package com.example.backend.domain.auth;

import com.example.backend.DTO.ResponseOneDTO;
import com.example.backend.DTO.SingInDTO;
import com.example.backend.DTO.SingUpDTO;
import com.example.backend.DTO.TokensDTO;
import com.example.backend.global.ResponseClass;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RequestMapping("/api/v1/auth")
@RestController
public class AuthController {
    private final ResponseClass responseClass;
    private final AuthService authService;

    @PostMapping("/singUp")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseOneDTO<String> singUp(@Valid @RequestBody SingUpDTO singUpDTO){
        return responseClass.massageReturn(
                authService.signUp(
                        singUpDTO.getLoginId(), singUpDTO.getNickname(), singUpDTO.getPw(), singUpDTO.getCheckPw()
                )
        );
    }

    @PostMapping("/login")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseOneDTO<TokensDTO> signUp(@Valid @RequestBody SingInDTO singInDTO){
        return new ResponseOneDTO<>(true,"토큰 반환 성공",authService.signIn(singInDTO.getLoginId(), singInDTO.getPw()));
    }

    @PostMapping("/logout")
    public ResponseOneDTO<String> logout(@Header("Authorization") String token){
        return responseClass.massageReturn(authService.logout(token));
    }
}
