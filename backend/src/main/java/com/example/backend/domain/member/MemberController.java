package com.example.backend.domain.member;

import com.example.backend.DTO.ResponseDTO;
import com.example.backend.DTO.ResponseOneDTO;
import com.example.backend.DTO.SingInDTO;
import com.example.backend.DTO.SingUpDTO;
import com.example.backend.global.ResponseClass;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/members")
public class MemberController {
    private final MemberService memberService;
    private final ResponseClass responseClass;

    @PostMapping()
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseOneDTO<String> singUp(@Valid @RequestBody SingInDTO singInDTO){
        return responseClass.massageReturn(
                memberService.signUp(
                        singInDTO.getName(), singInDTO.getPw(), singInDTO.getCheckPw()
                )
        );
    }

    @PostMapping("/signIn")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseOneDTO<String> signUp(@Valid @RequestBody SingUpDTO singUpDTO){
        return responseClass.tokenReturn(memberService.signIn(singUpDTO.getName(), singUpDTO.getPw()));
    }

    @GetMapping()
    public ResponseDTO<?> getAllMember(){
        return responseClass.successReturn("맴버 전체 조회", memberService.getAllMember());
    }
}
