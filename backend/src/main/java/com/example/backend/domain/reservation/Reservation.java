package com.example.backend.domain.reservation;

import com.example.backend.domain.group.Group;
import com.example.backend.domain.user.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Entity
@NoArgsConstructor
@AllArgsConstructor
public class Reservation {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    Long id;

    ReservationStatus reservationStatus=ReservationStatus.REQUEST;
    @ManyToOne
    @OnDelete(action = OnDeleteAction.CASCADE)
    User fromUser;
    @ManyToOne
    @OnDelete(action = OnDeleteAction.CASCADE)
    User toUser;
    @ManyToOne
    @OnDelete(action = OnDeleteAction.CASCADE)
    Group group;
}
