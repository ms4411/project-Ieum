package com.example.backend.domain.group;

import com.example.backend.domain.user.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name="club")
public class Group {
    @Id
    @Column(updatable = false)
    private UUID id;
    @Column(nullable = false)
    private String title;
    @Column(nullable = false)
    private String content;
    private String imgUrl;
    @Column(nullable = false)
    private LocalDateTime meetAt;
    //위도 경도
    @Column(nullable = false)
    private Double lat;
    @Column(nullable = false)
    private Double lng;
    private String address;
    //참여자
    @Column(nullable = false)
    @Min(2)
    private int maxPeople;
    @Column(nullable = false)
    @Min(1)
    @Builder.Default
    private int currentMemberCount=1;

    @ManyToOne
    @OnDelete(action = OnDeleteAction.CASCADE)
    private User createUser;

    public void changeTitle(String title){
        this.title=title;
    }
    public void changeContent(String content){
        this.content=content;
    }
    public void changeMaxPeople(int maxPeople){
        this.maxPeople=maxPeople;
    }

    public int addPeople(){
        this.currentMemberCount+=1;
        return this.currentMemberCount;
    }
    public int minersPeople(){
        this.currentMemberCount-=1;
        return this.currentMemberCount;
    }
}
