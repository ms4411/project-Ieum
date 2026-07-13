package com.example.backend.domain.member;

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

    public String signIn(String name, String pw){
        Member member= memberRepository.findByName(name).orElseThrow(LoginException::new);
        if(!passwordEncoder.matches(pw,member.getPw())){
            throw new LoginException();
        }
        Map<String, Object> data=new HashMap<>();
        String memberId=member.getId().toString();
        //리프레시 토큰 생성 및 저장
        refreshTokenRepository.save(
                new RefreshToken(
                        memberId, tokenManager.createRefreshToken(memberId)
                )
        );
        //액세스 토큰 반환
        return tokenManager.createAcceptToken(memberId, data);
    }

    public List<Member> getAllMember(){
        return memberRepository.findAll();
    }
}
