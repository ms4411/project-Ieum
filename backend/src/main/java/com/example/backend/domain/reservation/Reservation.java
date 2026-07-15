package com.example.backend.domain.reservation;

import com.example.backend.domain.group.Group;
import com.example.backend.domain.member.Member;
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

    GroupStatus groupStatus=GroupStatus.REQUEST;
    @ManyToOne
    Member fromMember;
    @ManyToOne
    Member toMember;
    @ManyToOne
    @OnDelete(action = OnDeleteAction.CASCADE)
    Group group;
}
