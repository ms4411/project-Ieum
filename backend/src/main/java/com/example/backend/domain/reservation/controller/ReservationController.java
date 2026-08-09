package com.example.backend.domain.reservation.controller;

import com.example.backend.DTO.ResponseDTO;
import com.example.backend.domain.reservation.ReservationService;
import com.example.backend.domain.reservation.ReservationStatus;
import com.example.backend.domain.reservation.RoleEnum;
import com.example.backend.domain.reservation.controller.dto.request.CreateReservationDTO;
import com.example.backend.global.ResponseClass;
import com.example.backend.global.error.Exception.CustomException;
import com.example.backend.global.error.Exception.ErrorCode;
import com.example.backend.global.security.TokenManager;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.example.backend.domain.reservation.controller.dto.request.UpdateStatusReservationDTO;

import java.util.Map;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1")
public class ReservationController {
    private final ReservationService reservationService;
    private final TokenManager tokenManager;
    private final ResponseClass responseClass;

    @PostMapping("/groups/{groupId}/join-requests")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseDTO.successRes createReservation(
            @PathVariable UUID groupId,
            @RequestHeader("Authorization") String token,
            @RequestBody CreateReservationDTO dto
    ){
        return ResponseDTO.successRes.builder()
                .data(
                        Map.of("newReservation",reservationService.createReservation(dto, token, groupId))
                )
                .build();
    }

    @DeleteMapping("/groups/{groupId}/join-requests/me")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteReservation(
            @PathVariable UUID groupId,
            @RequestHeader("Authorization") String token
    ){
        reservationService.deleteReservation(groupId,token);
    }

    @GetMapping("/groups/{groupId}/join-requests")
    @PreAuthorize("hasRole('HOST')")
    public ResponseDTO.successRes getAllReservationByStatus(
            @RequestHeader("Authorization") String token,
            @PathVariable UUID groupId,
            @RequestParam ReservationStatus status
    ){
        return responseClass.listReturn(reservationService.getByIdAndStatus(token, groupId, status));
    }

    @PatchMapping("/groups/{groupId}/join-requests/{reservationId}")
    @PreAuthorize("hasRole('HOST')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void changeStatus(
            @RequestHeader("Authorization") String token,
            @RequestBody UpdateStatusReservationDTO dto,
            @PathVariable UUID groupId,
            @PathVariable Long reservationId
    ){
        reservationService.changeStatus(token, groupId, reservationId, dto);

    }

    @GetMapping("/users/me/join-requests")
    public ResponseDTO.successRes getAllMyReservation(
            @RequestHeader("Authorization") String token,
            @RequestParam ReservationStatus status
    ){
        return responseClass.listReturn(reservationService.getMyReservationByStatus(token, status));
    }

    @GetMapping("/groups/{groupId}/members")
    public ResponseDTO.successRes getMyGroupMembers(
            @PathVariable UUID groupId,
            @RequestHeader("Authorization") String token
    ){
        return responseClass.listReturn(
                reservationService.getMyGroupMembers(groupId, token)
        );
    }

    @GetMapping("/users/me/groups")
    public ResponseDTO.successRes getMyGroup(
            @RequestHeader("Authorization") String token,
            @RequestParam(required = false) RoleEnum role
    ){
        return responseClass.listReturn(reservationService.getMyGroup(token, role));
    }
}
