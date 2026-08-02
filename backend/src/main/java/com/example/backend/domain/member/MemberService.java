package com.example.backend.domain.member;

import com.example.backend.DTO.TokensDTO;
import com.example.backend.domain.group.GroupRepository;
import com.example.backend.global.security.TokenManager;
import com.example.backend.global.error.Exception.LoginException;
import com.example.backend.global.security.refreshToken.RefreshToken;
import com.example.backend.global.security.refreshToken.RefreshTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MemberService {
    final PasswordEncoder passwordEncoder;
    private final MemberRepository memberRepository;
    private final TokenManager tokenManager;
    private final RefreshTokenRepository refreshTokenRepository;
    private final GroupRepository groupRepository;


    public List<Member> getAllMember(){
        return memberRepository.findAll();
    }
    public List<Member> getAllMemberByGroup(UUID groupId){
        return memberRepository.findAllByGroup(groupRepository.findById(groupId).orElseThrow());
    }

    public Member getMember(UUID id){
        return memberRepository.findById(id).orElseThrow();
    }
}
