package com.example.backend.user;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {
    final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;

    public String userCreate(String name, String pw){
        User user = new User(name, passwordEncoder.encode(pw));
        userRepository.save(user);
        return "회원가입 성공";
    }
}
