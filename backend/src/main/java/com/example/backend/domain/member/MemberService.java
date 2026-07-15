package com.example.backend.domain.member;

import com.example.backend.DTO.TokensDTO;
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

    public String signUp(String name, String pw, String checkPw){
        if(pw.equals(checkPw)){
            return "비밀번호가 일치하지 않습니다";
        }
        Member member = new Member(name, passwordEncoder.encode(pw));
        memberRepository.save(member);
        return "회원가입 성공";
    }

    public TokensDTO signIn(String name, String pw){
        Member member= memberRepository.findByName(name).orElseThrow(LoginException::new);
        if(!passwordEncoder.matches(pw,member.getPw())){
            throw new LoginException();
        }
        Map<String, Object> data=new HashMap<>();
        String memberId=member.getId().toString();
        //리프레시 토큰 생성 및 저장
        TokensDTO tokens=tokenManager.createTokens(memberId, data);
        refreshTokenRepository.save(new RefreshToken(memberId, tokens.getRefreshToken()));
        return tokens;
    }

    public List<Member> getAllMember(){
        return memberRepository.findAll();
    }

    public Member getMember(UUID id){
        return memberRepository.findById(id).orElseThrow();
    }
}
