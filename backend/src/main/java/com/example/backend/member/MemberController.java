package com.example.backend.member;

import com.example.backend.DTO.ListDTO;
import com.example.backend.DTO.MemberAcceptDTO;
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
    public ResponseEntity<Map<String, String>> singUp(@RequestBody MemberAcceptDTO memberAcceptDTO){
        return responseClass.massageReturn(
                memberService.signUp(
                        memberAcceptDTO.getName(), memberAcceptDTO.getPw()
                )
        );
    }

    @PostMapping("/signIn")
    public ResponseEntity<Map<String, String>> signUp(@RequestBody MemberAcceptDTO memberAcceptDTO){
        return responseClass.tokenReturn(memberService.signIn(memberAcceptDTO.getName(),memberAcceptDTO.getPw()));
    }

    @GetMapping()
    public ResponseEntity<ListDTO> getAllMember(){
        return responseClass.listReturn(memberService.getAllMember());
    }
}
