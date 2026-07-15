package com.example.backend.domain.group;

import com.example.backend.domain.member.Member;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@NoArgsConstructor
@AllArgsConstructor
public class Group {
    @Id
    final UUID id=UUID.randomUUID();
    @Column(nullable = false)
    String head;
    @Column(nullable = false)
    String content;
    String imgUrl;
    @Column(nullable = false)
    LocalDateTime dateTime;
    //위도 경도
    @Column(nullable = false)
    Long lat;
    @Column(nullable = false)
    Long lng;
    //참여자
    @Column(nullable = false)
    Long maxPeople;
    @Column(nullable = false)
    UUID createUserId;

    List<Member> inMembers;

}
