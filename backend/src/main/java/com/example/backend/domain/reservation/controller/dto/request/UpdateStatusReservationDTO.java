package com.example.backend.domain.reservation.controller.dto.request;

import com.example.backend.domain.reservation.ReservationStatus;

public record UpdateStatusReservationDTO(
        ReservationStatus status
) {
}
