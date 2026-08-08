package com.example.backend.domain.auth;

import com.example.backend.DTO.responseDTO.TokensDTO;
import com.example.backend.domain.user.User;
import com.example.backend.domain.user.UserRepository;
import com.example.backend.global.error.Exception.CustomException;
import com.example.backend.global.error.Exception.ErrorCode;
import com.example.backend.global.security.TokenManager;
import com.example.backend.global.security.refreshToken.RefreshToken;
import com.example.backend.global.security.refreshToken.RefreshTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.MessageDigest;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final TokenManager  tokenManager;

    public String signUp(String loginId, String name, String pw, String checkPw){
        if(!pw.equals(checkPw)){
            throw new CustomException(ErrorCode.PASSWORD_NOT_EQUALS);
        }
        User user = User.builder()
                .id(UUID.randomUUID())
                .loginId(loginId)
                .pw(passwordEncoder.encode(pw))
                .nickname(name)
                .build();
        userRepository.save(user);
        return "회원가입 성공";
    }

    public TokensDTO signIn(String loginId, String pw){
        User user = userRepository.findByLoginId(loginId).orElseThrow(()-> new CustomException(ErrorCode.LOGIN_FAILED));
        if(!passwordEncoder.matches(pw, user.getPw())){
            throw new CustomException(ErrorCode.LOGIN_FAILED);
        }
        Map<String, Object> data=new HashMap<>();
        String memberId= user.getId().toString();
        return tokenManager.createTokens(memberId, data);
    }

    public String logout(String token){
        String sub=tokenManager.getSubject(token);
        RefreshToken refreshToken=refreshTokenRepository.findById(sub).orElseThrow();
        refreshTokenRepository.delete(refreshToken);
        return "로그아웃 성공";
    }

    public TokensDTO refresh(
            TokensDTO dto
    ){
        String sub=tokenManager.getSubject(dto.getRefreshToken());
        RefreshToken refreshToken=refreshTokenRepository
                .findById(sub)
                .orElseThrow(()->new CustomException(ErrorCode.REFRESH_TOKEN_NOT_FOUND));
        if(!MessageDigest.isEqual(
                refreshToken.getToken().getBytes(),
                tokenManager.hashToken(dto.getRefreshToken()).getBytes())
        ) {
            throw new CustomException(ErrorCode.INVALID_REQUEST);
        }
        Object role=tokenManager
                .expiredTokenGetPayload(dto.getAcceptToken())
                .get("role");
        Object createGroupId=tokenManager
                .expiredTokenGetPayload(dto.getAcceptToken())
                .get("createGroupId");

        Map<String, Object> data=new HashMap<>();
        if (role!=null){
            data.put("role", role);
        }
        if (createGroupId!=null){
            data.put("createGroupId", createGroupId);
        }
        return tokenManager.createTokens(sub, data);
    }
}
