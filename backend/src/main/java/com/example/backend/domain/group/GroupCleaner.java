package com.example.backend.domain.group;


import com.example.backend.domain.group.repository.GroupRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Component
@EnableScheduling
@RequiredArgsConstructor
public class GroupCleaner {
    private final GroupRepository groupRepository;

    @Scheduled(cron = "0 0 3 * * ?")
    @Transactional
    public void deleteGroups(){
        groupRepository.deleteAllByMeetAtBefore(LocalDateTime.now().plusHours(2));
    }
}
