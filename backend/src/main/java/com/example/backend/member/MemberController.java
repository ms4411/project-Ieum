package com.example.backend.member;

import com.example.backend.DTO.UserAcceptDTO;
import com.example.backend.global.ResponseClass;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/members")
public class MemberController {
    private final MemberService memberService;
    private final ResponseClass responseClass;

    @PostMapping()
    public ResponseEntity<?> memberCreate(@RequestBody UserAcceptDTO memberAcceptDTO){
        String name=memberAcceptDTO.getName();
        String pw=memberAcceptDTO.getPw();
        return responseClass.massageReturn(memberService.memberCreate(name, pw));
    }

    @PostMapping("/singUp")
    public ResponseEntity<?> singUp(@RequestBody UserAcceptDTO memberAcceptDTO){
        return responseClass.tokenReturn(memberService.singUp(memberAcceptDTO.getName(),memberAcceptDTO.getPw()));
    }

    @GetMapping()
    public ResponseEntity<?> memberGetAll(){
        return responseClass.listReturn(memberService.memberGetAll());
    }
}
