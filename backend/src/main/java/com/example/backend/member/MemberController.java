package com.example.backend.member;

import com.example.backend.DTO.ListDTO;
import com.example.backend.DTO.SingInDTO;
import com.example.backend.DTO.SingUpDTO;
import com.example.backend.global.ResponseClass;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/members")
public class MemberController {
    private final MemberService memberService;
    private final ResponseClass responseClass;

    @PostMapping()
    public ResponseEntity<Map<String, String>> singUp(@RequestBody SingInDTO singInDTO){
        return responseClass.massageReturn(
                memberService.signUp(
                        singInDTO.getName(), singInDTO.getPw(), singInDTO.getCheckPw()
                )
        );
    }

    @PostMapping("/signIn")
    public ResponseEntity<Map<String, String>> signUp(@RequestBody SingUpDTO singUpDTO){
        return responseClass.tokenReturn(memberService.signIn(singUpDTO.getName(), singUpDTO.getPw()));
    }

    @GetMapping()
    public ResponseEntity<ListDTO> getAllMember(){
        return responseClass.listReturn(memberService.getAllMember());
    }
}
