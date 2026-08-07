package com.example.backend.domain.group.repository;

import com.example.backend.domain.group.Group;
import com.example.backend.domain.group.QGroup;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
@RequiredArgsConstructor
public class GroupRepositoryCustom {
    private final JPAQueryFactory queryFactory;

    public List<Group> searchGroup(
            Double swLat, Double swLng,
            Double neLat, Double neLng,
            String keyword,
            LocalDateTime meetAt
    ){
        QGroup group=QGroup.group;
        return queryFactory
                .selectFrom(group)
                .where(
                        group.lat.between(swLat, neLat),
                        group.lng.between(swLng, neLng),
                        keyword!=null ? group.title.contains(keyword): null,
                        meetAt != null ? group.meetAt.between(meetAt, meetAt.plusHours(1)) : null
                )
                .fetch();
    }
}
