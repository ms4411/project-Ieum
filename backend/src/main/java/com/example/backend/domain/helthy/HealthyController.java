package com.example.backend.domain.helthy;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class HealthyController {
    private final HealthyService healthyService;
    @GetMapping
    public String Healthy(){
        return healthyService.Healthy();
    }
}
