package com.example.backend.domain.group.service;

import com.example.backend.DTO.requestDTO.CreateGroupDTO;
import com.example.backend.DTO.requestDTO.UpdateGroupDTO;
import com.example.backend.DTO.responseDTO.TokensDTO;
import com.example.backend.domain.group.Group;
import com.example.backend.domain.group.repository.GroupRepository;
import com.example.backend.domain.group.repository.GroupRepositoryCustom;
import com.example.backend.domain.user.UserRepository;
import com.example.backend.global.error.Exception.CustomException;
import com.example.backend.global.error.Exception.ErrorCode;
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
@Transactional(readOnly = true, rollbackFor = CustomException.class, timeout = 60) //1분 이상 소요시 자동 롤백
public class GroupService {
    private final GroupRepository groupRepository;
    private final GroupRepositoryCustom groupRepositoryCustom;
    private final UserRepository userRepository;
    private final TokenManager tokenManager;

    @Transactional
    @Builder(builderMethodName = "createGroupBuilder")
    public Map<String, Object> createGroup(
            CreateGroupDTO groupDTO,
            String token
    ){
        UUID createUserId=UUID.fromString(tokenManager.getSubject(token));
        Group group=Group.builder()
                .id(UUID.randomUUID())
                .title(groupDTO.title())
                .content(groupDTO.content())
                .createUser(userRepository.findById(createUserId).orElseThrow())
                .lat(groupDTO.lat())
                .lng(groupDTO.lng())
                .address(groupDTO.address())
                .meetAt(groupDTO.meetAt())
                .maxPeople(groupDTO.maxMemberCnt())
                .imgUrl(groupDTO.imgUrl())
                .build();
        groupRepository.save(group);
        TokensDTO tokens=tokenManager.createTokens(
                createUserId.toString(),
                Map.of("role", "ROLE_HOST","createGroupId",group.getId())
        );
        return Map.of(
                "tokens",tokens,
                "newGroup",group
        );
    }

    public Group getGroupById(UUID groupId){
        return groupRepository
                .findById(groupId)
                .orElseThrow(()->new CustomException(ErrorCode.GROUP_NOT_FOUND));
    }

    public List<Group> searchGroup(
            Double swLat, Double swLng,
            Double neLat, Double neLng,
            String keyword,
            LocalDateTime meetAt
    ){
        return groupRepositoryCustom.searchGroup(swLat, swLng, neLat, neLng, keyword, meetAt);
    }

    @Transactional
    public void deleteGroup(
            UUID groupId,
            String token
    ){
        Group group=groupRepository
                .findById(groupId)
                .orElseThrow(()-> new CustomException(ErrorCode.GROUP_NOT_FOUND));
        if(!group.getCreateUser().getId().equals(UUID.fromString(tokenManager.getSubject(token)))){
            throw new CustomException(ErrorCode.FORBIDDEN);
        }
        groupRepository.delete(group);
    }

    @Transactional()
    public void updateGroup(
            UUID groupId,
            UpdateGroupDTO dto,
            String token
    ){
        Group group=groupRepository
                .findById(groupId)
                .orElseThrow(()-> new CustomException(ErrorCode.GROUP_NOT_FOUND));
        if(!group.getCreateUser().getId().equals(UUID.fromString(tokenManager.getSubject(token)))){
            throw new CustomException(ErrorCode.FORBIDDEN);
        }
        int updateCnt=groupRepository.changeMaxPeople(groupId, dto.maxMember());
        if(updateCnt==0){
            throw new CustomException(ErrorCode.SMALL_CURRENT_THEN_MAX);
        }
        group.changeTitle(dto.title());
        group.changeContent(dto.content());
    }
}
