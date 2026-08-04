package com.example.backend.domain.group;

import com.example.backend.domain.user.User;
import com.example.backend.domain.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.UUID;

@RequiredArgsConstructor
@Service
public class GroupService {
    private final GroupRepository groupRepository;
    private final UserRepository userRepository;

    public Group createGroup(
            String content,
            String title,
            String imgUrl,
            int maxMemberCnt,
            int lat,
            int lng,
            String address,
            LocalDateTime meatAt,
            UUID createUserId
    ){
        Group group=Group.builder()
                .title(title)
                .content(content)
                .createUser(userRepository.findById(createUserId).orElseThrow())
                .lat(lat)
                .lng(lng)
                .address(address)
                .meetAt(meatAt)
                .maxPeople(maxMemberCnt)
                .imgUrl(imgUrl)
                .build();
        groupRepository.save(group);
        return group;
    }
}
