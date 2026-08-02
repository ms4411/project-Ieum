package com.example.backend.domain.member;

import com.example.backend.DTO.*;
import com.example.backend.global.ResponseClass;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/members")
public class MemberController {
    private final MemberService memberService;
    private final ResponseClass responseClass;


    @GetMapping()
    public ResponseDTO<?> getAllMember(){
        return responseClass.successReturn("맴버 전체 조회 성공", memberService.getAllMember());
    }

    @GetMapping("/{gruopId}")
    public ResponseDTO<?> getAllMemberByGroup(@RequestParam UUID groupId){
        return responseClass.successReturn("모임 멤버 조회 성공", memberService.getAllMemberByGroup(groupId));
    }
}
