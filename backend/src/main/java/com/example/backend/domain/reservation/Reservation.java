package com.example.backend.domain.reservation;

import com.example.backend.domain.group.Group;
import com.example.backend.domain.user.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDateTime;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Reservation {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    Long id;
    @ManyToOne
    @OnDelete(action = OnDeleteAction.CASCADE)
    Group group;

    @ManyToOne
    @OnDelete(action = OnDeleteAction.CASCADE)
    User user;
    String userNickname;
    @ManyToOne
    @OnDelete(action = OnDeleteAction.CASCADE)
    User host;
    @Enumerated(EnumType.STRING)
    ReservationStatus status=ReservationStatus.PENDING;

    String message;
    LocalDateTime requestedAt=LocalDateTime.now();
    LocalDateTime respondedAt=null;

    public void changeStatus(ReservationStatus status){
        this.status=status;
    }
}
