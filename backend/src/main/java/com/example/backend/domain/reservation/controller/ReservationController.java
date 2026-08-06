package com.example.backend.domain.reservation.controller;

import com.example.backend.DTO.ResponseDTO;
import com.example.backend.domain.reservation.Reservation;
import com.example.backend.domain.reservation.ReservationService;
import com.example.backend.domain.reservation.ReservationStatus;
import com.example.backend.domain.reservation.controller.dto.request.CreateReservationDTO;
import com.example.backend.global.ResponseClass;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.example.backend.domain.reservation.controller.dto.request.UpdateStatusReservationDTO;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class ReservationController {
    private final ReservationService reservationService;
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
    public List<Reservation> getAllReservationByStatus(
            @PathVariable UUID groupId,
            @RequestParam ReservationStatus status
    ){
        return reservationService.getByIdAndStatus(groupId, status);
    }

    @PatchMapping("/groups/{groupId}/join-requests/{reservationId}")
    @PreAuthorize("hasRole('HOST')")
    public void changeStatus(
            @PathVariable UUID groupId,
            @RequestBody UpdateStatusReservationDTO dto,
            @PathVariable Long reservationId
    ){
        reservationService.changeStatus(groupId, reservationId, dto);
    }

    @GetMapping("/users/me/join-requests?")
    public List<Reservation> getAllMyReservation(
            @RequestHeader("Authorization") String token,
            @RequestParam ReservationStatus status
    ){
        //이어서 하기
        return new  ArrayList();
    }
}
