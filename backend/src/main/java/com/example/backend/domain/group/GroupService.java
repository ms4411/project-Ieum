package com.example.backend.domain.group;

import com.example.backend.DTO.CreateGroupDTO;
import com.example.backend.DTO.TokensDTO;
import com.example.backend.domain.user.UserRepository;
import com.example.backend.global.security.TokenManager;
import lombok.Builder;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RequiredArgsConstructor
@Service
public class GroupService {
    private final GroupRepository groupRepository;
    private final GroupRepositoryCustom groupRepositoryCustom;
    private final UserRepository userRepository;
    private final TokenManager tokenManager;

    @Builder(builderMethodName = "createGroupBuilder")
    public Map<String, Object> createGroup(
            CreateGroupDTO groupDTO,
            String token
    ){
        UUID createUserId=UUID.fromString(tokenManager.getSubject(token));
        Group group=Group.builder()
                .title(groupDTO.title())
                .content(groupDTO.content())
                .createUser(userRepository.findById(createUserId).orElseThrow())
                .lat(groupDTO.lat())
                .lng(groupDTO.lng())
                .address(groupDTO.address())
                .meetAt(groupDTO.meatAt())
                .maxPeople(groupDTO.maxMemberCnt())
                .imgUrl(groupDTO.imgUrl())
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

    public List<Group> searchGroup(
            Double swLat, Double swLng,
            Double neLat, Double neLng,
            LocalDateTime meetAt
    ){
        return groupRepositoryCustom.searchGroup(swLat, swLng, neLat, neLng, meetAt);
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
