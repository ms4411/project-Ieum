package com.example.backend.domain.reservation.controller.dto.request;

import com.example.backend.domain.reservation.RoleEnum;

public record CreateReservationDTO(
        String message,
        RoleEnum role
) {
}
