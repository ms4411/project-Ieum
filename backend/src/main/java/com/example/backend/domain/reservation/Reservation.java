package com.example.backend.domain.reservation;

import com.example.backend.domain.group.Group;
import com.example.backend.domain.user.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDateTime;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
public class Reservation {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    private Long id;
    @ManyToOne
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Group group;

    @ManyToOne
    @OnDelete(action = OnDeleteAction.CASCADE)
    private User user;
    private String userNickname;
    @ManyToOne
    @OnDelete(action = OnDeleteAction.CASCADE)
    private User host;
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private ReservationStatus status=ReservationStatus.PENDING;
    @Enumerated(EnumType.STRING)
    private RoleEnum role;

    private String message;
    @Builder.Default
    private LocalDateTime requestedAt=LocalDateTime.now();
    @Builder.Default
    private LocalDateTime respondedAt=null;

    public void responded(){
        this.respondedAt=LocalDateTime.now();
    }
    public void changeStatus(ReservationStatus status){
        this.status=status;
        if (this.status!=ReservationStatus.PENDING) {
            responded();
        }
    }
}
