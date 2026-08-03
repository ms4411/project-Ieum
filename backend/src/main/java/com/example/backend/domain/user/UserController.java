package com.example.backend.domain.user;

import com.example.backend.DTO.*;
import com.example.backend.global.ResponseClass;
import com.example.backend.global.security.TokenManager;
import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/users")
public class UserController {
    private final UserService userService;
    private final ResponseClass responseClass;
    private final TokenManager tokenManager;


    @GetMapping()
    public ResponseDTO<?> getAllUser(){
        return responseClass.successReturn("유저 전체 조회 성공", userService.getAllUser());
    }

    @GetMapping("/me")
    public ResponseOneDTO<Object> getMe(@Header("Authorization") String token){
        String sub = tokenManager.getSubject(token);
        return ResponseOneDTO.builder()
                .success(true)
                .message("조회 성공")
                .data(userService.getById(UUID.fromString(sub)))
                .build();
    }

    @PatchMapping("/me")
    public void changeNickname(OneDTO<String> data, @Header("Authorization")String token){
        userService.changeNickname(token, data.data());
    }

}
