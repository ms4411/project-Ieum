package com.example.backend.domain.user;

import com.example.backend.global.security.TokenManager;
import com.example.backend.global.security.refreshToken.RefreshTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final TokenManager tokenManager;
    private final RefreshTokenRepository refreshTokenRepository;


    public List<User> getAllUser(){
        return userRepository.findAll();
    }
    public User getById(UUID id){
        return userRepository.findById(id).orElseThrow();
    }

    @Transactional
    public void changeNickname(String token, String nickname){
        User user=userRepository.findById(
                UUID.fromString(
                        tokenManager.getSubject(token)
                )
        ).orElseThrow();
        user.changeNickname(nickname);
    }

    public void deleteUser(String token){
        User user=userRepository.findById(
                UUID.fromString(
                        tokenManager.getSubject(token)
                )
        ).orElseThrow();
        userRepository.delete(user);
    }
}
