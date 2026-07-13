package com.example.backend.global;

import com.example.backend.DTO.ResponseDTO;
import com.example.backend.DTO.ResponseOneDTO;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Getter
@NoArgsConstructor
@Component
public class ResponseClass {
    public ResponseDTO<?> successReturn(String message, List<?> data){
        return new ResponseDTO<>(true, message, data);
    }
    public ResponseOneDTO<String> massageReturn(String massage){
        return new ResponseOneDTO<String>(true, "메세지 반환", massage);
    }
    public ResponseOneDTO<String> tokenReturn(String token){
        return new ResponseOneDTO<String>(true, "토큰 반환", token);
    }
}
