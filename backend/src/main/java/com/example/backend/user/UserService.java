package com.example.backend.user;

import com.example.backend.global.security.TokenManager;
import com.example.backend.global.security.error.Exception.LoginException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class UserService {
    final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final TokenManager tokenManager;

    public String userCreate(String name, String pw){
        User user = new User(name, passwordEncoder.encode(pw));
        userRepository.save(user);
        return "회원가입 성공";
    }

    public String singUp(String name, String pw){
        User user= userRepository.findByName(name).orElseThrow(LoginException::new);
        if(passwordEncoder.matches(pw,user.getPw())){
            throw new LoginException();
        }
        Map<String, Object> data=new HashMap<>();
        data.put("role", "user");
        return new TokenManager().createToken(user.getId().toString(), data);
    }
}
