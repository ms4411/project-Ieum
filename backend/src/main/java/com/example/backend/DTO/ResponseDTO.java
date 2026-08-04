package com.example.backend.DTO;

import lombok.Builder;
import org.springframework.http.HttpStatus;

import java.util.Map;

public class ResponseDTO{

    public record successRes(
            Boolean success,
            Map<String,?> data
    ){
        @Builder
        public successRes(Map<String,?> data){
            this(true, data);
        }
    }

    public record errorRes(
            boolean success,
            Map<String,?> error
    ) {
        @Builder
        public errorRes(HttpStatus code, String message) {
            this(
                    false,
                    Map.of("code", code, "message", message)
            );
        }
    }
}
