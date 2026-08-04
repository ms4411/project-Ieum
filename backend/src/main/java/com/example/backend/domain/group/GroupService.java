package com.example.backend.domain.group;

import com.example.backend.DTO.TokensDTO;
import com.example.backend.domain.user.UserRepository;
import com.example.backend.global.security.TokenManager;
import lombok.Builder;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@RequiredArgsConstructor
@Service
public class GroupService {
    private final GroupRepository groupRepository;
    private final UserRepository userRepository;
    private final TokenManager tokenManager;

    @Builder(builderMethodName = "createGroupBuilder")
    public Map<String, Object> createGroup(
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
        TokensDTO tokens=tokenManager.createTokens(
                createUserId.toString(),
                Map.of("role", "ROLE_HOST")
        );
        return Map.of(
                "tokens",tokens,
                "newGroup",group
        );
    }

    //에러처리
    public Group getGroupById(UUID groupId){
        return groupRepository.findById(groupId).orElseThrow();
    }

    //에러처리
    public void deleteGroup(UUID groupId){
        groupRepository.delete(
                groupRepository.findById(groupId).orElseThrow()
        );
    }

    @Transactional
    public void updateGroup(
            UUID groupId,
            String title,
            String content,
            int maxMember
    ){
        Group group=groupRepository.findById(groupId).orElseThrow();

        group.changeTitle(title);
        group.changeContent(content);
        group.changeMaxPeople(maxMember); //무결성 주의. 나중에 수정해야됨
    }
}
