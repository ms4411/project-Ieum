package com.example.backend.domain.group;

import com.example.backend.DTO.CreateGroupDTO;
import com.example.backend.DTO.ResponseDTO;
import com.example.backend.DTO.UpdateGroupDTO;
import com.example.backend.global.ResponseClass;
import com.example.backend.global.security.TokenManager;
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
    private final ResponseClass responseClass;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseDTO.successRes createGroup(@RequestHeader("Authorization") String token, @RequestBody CreateGroupDTO createGroupDTO){
        Map<String,Object> data= groupService.createGroup(createGroupDTO, token);
        return ResponseDTO.successRes.builder()
                .data(data)
                .build();
    }
    @GetMapping("{groupId}")
    public ResponseDTO.successRes getGroupById(@PathVariable UUID groupId){
        Group group=groupService.getGroupById(groupId);
        return ResponseDTO.successRes.builder()
                .data(Map.of("group", group))
                .build();
    }

    @GetMapping
    public ResponseDTO.successRes searchGroup(
            @RequestParam Double swLat,@RequestParam Double swLng,
            @RequestParam Double neLat,@RequestParam Double neLng,
            @RequestParam LocalDateTime meetAt
    ){
        return responseClass.listReturn("groups", groupService.searchGroup(swLat,swLng,neLat,neLng,meetAt));
    }

    @PreAuthorize("hasRole('HOST')")
    @PatchMapping("{groupId}")
    public void patchGroup(@PathVariable UUID groupId, @RequestBody UpdateGroupDTO updateGroupDTO){
        groupService.updateGroup(
                groupId,
                updateGroupDTO.title(),
                updateGroupDTO.content(),
                updateGroupDTO.maxMember()
        );
    }

    @PreAuthorize("hasRole('HOST')")
    @DeleteMapping("/{groupId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteGroup(@PathVariable UUID groupId){
        groupService.deleteGroup(groupId);
    }
}

