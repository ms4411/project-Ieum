package com.example.backend.domain.group;

import com.example.backend.DTO.requestDTO.CreateGroupDTO;
import com.example.backend.DTO.ResponseDTO;
import com.example.backend.DTO.requestDTO.UpdateGroupDTO;
import com.example.backend.domain.group.service.CreateGroupFacade;
import com.example.backend.domain.group.service.GroupService;
import com.example.backend.global.ResponseClass;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/v1/groups")
public class GroupController {
    private final GroupService groupService;
    private final CreateGroupFacade createGroupFacade;
    private final ResponseClass responseClass;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseDTO.successRes createGroup(
            @RequestHeader("Authorization") String token,
            @RequestBody CreateGroupDTO createGroupDTO
    ){
        Map<String,Object> data= createGroupFacade.createGroup(
                createGroupDTO,
                token
        );
        return ResponseDTO.successRes.builder()
                .data(data)
                .build();
    }
    @GetMapping("{groupId}")
    public ResponseDTO.successRes getGroupById(@PathVariable UUID groupId){
        Group group=groupService.getGroupById(groupId);
        return ResponseDTO.successRes.builder()
                .data(group)
                .build();
    }

    @GetMapping
    public ResponseDTO.successRes searchGroup(
            @RequestParam Double swLat,@RequestParam Double swLng,
            @RequestParam Double neLat,@RequestParam Double neLng,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) LocalDateTime meetAt
    ){
        return responseClass.listReturn(groupService.searchGroup(swLat,swLng,neLat,neLng,keyword, meetAt));
    }

    @PreAuthorize("hasRole('HOST')")
    @PatchMapping("{groupId}")
    public void patchGroup(
            @PathVariable UUID groupId,
            @RequestBody UpdateGroupDTO updateGroupDTO,
            @RequestHeader("Authorization") String token
    ){
        groupService.updateGroup(
                groupId,
                updateGroupDTO,
                token
        );
    }

    @PreAuthorize("hasRole('HOST')")
    @DeleteMapping("/{groupId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteGroup(
            @PathVariable UUID groupId,
            @RequestHeader("Authorization") String token
    ){
        groupService.deleteGroup(groupId, token);
    }
}

