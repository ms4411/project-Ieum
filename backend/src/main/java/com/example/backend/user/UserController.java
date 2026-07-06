package com.example.backend.user;

import com.example.backend.global.ResponseClass;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import tools.jackson.databind.JsonNode;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/users")
public class UserController {
    private final UserService userService;
    private final ResponseClass responseClass;

    @PostMapping()
    public ResponseEntity<?> userCreate(@RequestBody JsonNode jsonNode){
        String name=jsonNode.get("name").asString();
        String pw=jsonNode.get("pw").asString();
        return responseClass.massageReturn(userService.userCreate(name, pw));
    }
}
