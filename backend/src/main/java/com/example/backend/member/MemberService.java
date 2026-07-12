package com.example.backend.member;

import com.example.backend.global.security.TokenManager;
import com.example.backend.global.security.error.Exception.LoginException;
import com.example.backend.global.security.refreshToken.RefreshToken;
import com.example.backend.global.security.refreshToken.RefreshTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class MemberService {
    final PasswordEncoder passwordEncoder;
    private final MemberRepository memberRepository;
    private final TokenManager tokenManager;
    private final RefreshTokenRepository refreshTokenRepository;

    public String signUp(String name, String pw){
        Member member = new Member(name, passwordEncoder.encode(pw));
        memberRepository.save(member);
        return "회원가입 성공";
    }

    public String signIn(String name, String pw){
        Member member= memberRepository.findByName(name).orElseThrow(LoginException::new);
        if(!passwordEncoder.matches(pw,member.getPw())){
            throw new LoginException();
        }
        Map<String, Object> data=new HashMap<>();
        String memberId=member.getId().toString();
        refreshTokenRepository.save(new RefreshToken(memberId, tokenManager.createRefreshToken(memberId)));
        return tokenManager.createAcceptToken(memberId, data);
    }

    public List<?> getAllMember(){
        return memberRepository.findAll();
    }
}
