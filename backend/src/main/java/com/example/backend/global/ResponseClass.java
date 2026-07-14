package com.example.backend.global;

import com.example.backend.DTO.ResponseDTO;
import com.example.backend.DTO.ResponseOneDTO;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@NoArgsConstructor
@Component
public class ResponseClass {
    public ResponseDTO<?> successReturn(String message, List<?> data){
        return new ResponseDTO<>(true, message, data);
    }

    public ResponseOneDTO<String> massageReturn(String massage){
        return new ResponseOneDTO<String>(true, "메세지 반환", massage);
    }
}
