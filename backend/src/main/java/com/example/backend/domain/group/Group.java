package com.example.backend.domain.group;

import com.example.backend.domain.user.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name="club")
public class Group {
    @Id
    final UUID id=UUID.randomUUID();
    @Column(nullable = false)
    String title;
    @Column(nullable = false)
    String content;
    String imgUrl;
    @Column(nullable = false)
    LocalDateTime meetAt;
    //위도 경도
    @Column(nullable = false)
    int lat;
    @Column(nullable = false)
    int lng;
    String address;
    //참여자
    @Column(nullable = false)
    int maxPeople;
    @OneToOne
    @OnDelete(action = OnDeleteAction.CASCADE)
    User createUser;
}
