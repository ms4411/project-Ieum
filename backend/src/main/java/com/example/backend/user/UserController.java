package com.example.backend.user;

import com.example.backend.DTO.UserAcceptDTO;
import com.example.backend.global.ResponseClass;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/users")
public class UserController {
    private final UserService userService;
    private final ResponseClass responseClass;

    @PostMapping()
    public ResponseEntity<?> userCreate(@RequestBody UserAcceptDTO userAcceptDTO){
        String name=userAcceptDTO.getName();
        String pw=userAcceptDTO.getPw();
        return responseClass.massageReturn(userService.userCreate(name, pw));
    }

    @PostMapping("/singUp")
    public ResponseEntity<?> singUp(@RequestBody UserAcceptDTO userAcceptDTO){
        return responseClass.tokenReturn(userService.singUp(userAcceptDTO.getName(),userAcceptDTO.getPw()));
    }
}
