package com.example.backend.domain.group.service;

import com.example.backend.DTO.requestDTO.CreateGroupDTO;
import com.example.backend.domain.group.Group;
import com.example.backend.domain.reservation.Reservation;
import com.example.backend.domain.reservation.ReservationService;
import com.example.backend.domain.reservation.ReservationStatus;
import com.example.backend.domain.reservation.RoleEnum;
import com.example.backend.domain.reservation.controller.dto.request.CreateReservationDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class CreateGroupFacade {
    private final GroupService groupService;
    private final ReservationService reservationService;

    @Transactional
    public Map<String, Object> createGroup(
            CreateGroupDTO groupDTO,
            String token
    ){
        Map<String, Object> responseMap= groupService.createGroup(groupDTO, token);
        if(responseMap.get("newGroup") instanceof Group group){
            Reservation reservation =reservationService.createReservation(
                    new CreateReservationDTO("", RoleEnum.HOST),
                    token,
                    group.getId()
            );
            reservation.changeStatus(ReservationStatus.APPROVED);
        }
        return responseMap;
    }
}
