package com.example.backend.domain.user;

import com.example.backend.DTO.*;
import com.example.backend.global.ResponseClass;
import com.example.backend.global.security.TokenManager;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/users")
public class UserController {
    private final UserService userService;
    private final ResponseClass responseClass;
    private final TokenManager tokenManager;


    @GetMapping()
    public ResponseDTO.successRes getAllUser(){
        return responseClass.listReturn("유저 목록", userService.getAllUser());
    }

    @GetMapping("/me")
    public ResponseDTO.successRes getMe(@Header("Authorization") String token){
        String sub = tokenManager.getSubject(token);
        return ResponseDTO.successRes.builder()
                .data(Map.of("myData",userService.getById(UUID.fromString(sub))))
                .build();
    }

    @PatchMapping("/me")
    public void changeNickname(OneDTO<String> NewNickname, @Header("Authorization")String token){
        userService.changeNickname(token, NewNickname.data());
    }

    @DeleteMapping("/me")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteUser(@Header("Authorization")String token){
        userService.deleteUser(token);
    }
}
