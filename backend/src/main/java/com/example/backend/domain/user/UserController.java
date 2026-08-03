package com.example.backend.domain.user;

import com.example.backend.DTO.*;
import com.example.backend.global.ResponseClass;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/users")
public class UserController {
    private final UserService userService;
    private final ResponseClass responseClass;


    @GetMapping()
    public ResponseDTO<?> getAllUser(){
        return responseClass.successReturn("유저 전체 조회 성공", userService.getAllUser());
    }

}
