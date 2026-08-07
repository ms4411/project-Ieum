package com.example.backend.domain.auth;

import com.example.backend.DTO.ResponseDTO;
import com.example.backend.DTO.requestDTO.SingInDTO;
import com.example.backend.DTO.requestDTO.SingUpDTO;
import com.example.backend.DTO.responseDTO.TokensDTO;
import com.example.backend.global.ResponseClass;
import com.example.backend.global.error.Exception.CustomException;
import com.example.backend.global.error.Exception.ErrorCode;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
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
        try {
            return responseClass.messageReturn(
                    authService.signUp(
                            singUpDTO.getLoginId(), singUpDTO.getNickname(), singUpDTO.getPw(), singUpDTO.getCheckPw()
                    )
            );
        } catch (DataIntegrityViolationException e) {
            throw new CustomException(ErrorCode.LOGIN_ID_OVERLAP);
        }
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
    public ResponseDTO.successRes logout(@RequestHeader("Authorization") String token){
        return responseClass.messageReturn(authService.logout(token));
    }

    @PostMapping("/refresh")
    public ResponseDTO.successRes refresh(@RequestBody TokensDTO dto){
        return ResponseDTO.successRes.builder()
                .data(Map.of("tokens",authService.refresh(dto)))
                .build();
    }
}
