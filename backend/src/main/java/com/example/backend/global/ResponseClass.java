package com.example.backend.global;

import com.example.backend.DTO.ListDTO;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@Component
public class ResponseClass {
    public ResponseEntity<?> oneResponseReturn(String key, Object value){
        Map<String,Object> data=new HashMap<>();
        data.put(key, value);
        return ResponseEntity.ok(data);
    }
    public ResponseEntity<?> massageReturn(String massage){
        Map<String,String> data=new HashMap<String,String>();
        data.put("massage",massage);
        return ResponseEntity.ok(data);
    }
    public ResponseEntity<?> tokenReturn(String token){
        Map<String,String> data=new HashMap<String,String>();
        data.put("Authorization",token);
        return ResponseEntity.ok(data);
    }
    public ResponseEntity<?> listReturn(List<?> list){
        ListDTO listDTO = new ListDTO(list);
        return ResponseEntity.ok(listDTO);
    }
}
