package com.example.backend.domain.user;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name="users")
public class User {
    @Id
    @Column(unique = true, nullable = false)
    private UUID id;

    @Column(unique = true, nullable = false)
    private String loginId;

    @Column(nullable = false)
    private String nickname;

    @Column(nullable = false)
    @Size(min = 8, message = "최소 8글자 이상 입력")
    @JsonIgnore
    private String pw;

    public void changeNickname(String nickname){
        this.nickname=nickname;
    }
}
