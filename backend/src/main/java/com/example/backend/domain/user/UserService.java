package com.example.backend.domain.user;

import com.example.backend.global.security.TokenManager;
import com.example.backend.global.security.refreshToken.RefreshTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

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

    public User getUser(UUID id){
        return userRepository.findById(id).orElseThrow();
    }
}
