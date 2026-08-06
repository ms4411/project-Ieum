package com.example.backend.domain.reservation;

import com.example.backend.domain.group.Group;
import com.example.backend.domain.group.repository.GroupRepository;
import com.example.backend.domain.reservation.controller.dto.request.CreateReservationDTO;
import com.example.backend.domain.reservation.controller.dto.request.UpdateStatusReservationDTO;
import com.example.backend.domain.user.User;
import com.example.backend.domain.user.UserRepository;
import com.example.backend.global.error.Exception.CustomException;
import com.example.backend.global.error.Exception.ErrorCode;
import com.example.backend.global.security.TokenManager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ReservationService {
    private final ReservationRepository reservationRepository;
    private final UserRepository userRepository;
    private final GroupRepository groupRepository;
    private final TokenManager tokenManager;

    public Reservation createReservation(CreateReservationDTO dto, String token, UUID groupId){
        Group group=groupRepository
                .findById(groupId)
                .orElseThrow(()-> new CustomException(ErrorCode.GROUP_NOT_FOUND));
        User user=userRepository
                .findById(UUID.fromString(tokenManager.getSubject(token)))
                .orElseThrow(()-> new CustomException(ErrorCode.USER_NOT_FOUND));
        //예외처리
        if(group.getCreateUser().getId().equals(user.getId())){ //본인의 모임에 신청
            throw new CustomException(ErrorCode.HOST_CANNOT_REQUEST);
        } else if (group.getCurrentMemberCount()>=group.getMaxPeople()) { //정원 마감
            throw new CustomException(ErrorCode.GROUP_FULL);
        } else if (reservationRepository.existsByUserAndGroup(user,group)) { //이미 신청했거나 참여한 상태
            Reservation tempReservation=reservationRepository
                    .findByUserAndGroup(user,group)
                    .orElseThrow(()->new CustomException(ErrorCode.RESERVATION_NOT_FOUND));
            if(tempReservation.status==ReservationStatus.PENDING){
                throw new CustomException(ErrorCode.ALREADY_REQUESTED);
            } else if (tempReservation.status==ReservationStatus.APPROVED) {
                throw new CustomException(ErrorCode.ALREADY_MEMBER);

            }
        }
        Reservation reservation=Reservation.builder()
                .group(group)
                .user(user)
                .host(group.getCreateUser())
                .message(dto.message())
                .userNickname(user.getNickname())
                .build();
        reservationRepository.save(reservation);
        return reservation;
    }

    public void deleteReservation(UUID groupId, String token){
        Reservation reservation=reservationRepository
                .findByUser_IdAndGroup_Id(
                        UUID.fromString(tokenManager.getSubject(token)),
                        groupId
                )
                .orElseThrow(()->new CustomException(ErrorCode.RESERVATION_NOT_FOUND));
        if(reservation.status!=ReservationStatus.PENDING){
            throw new CustomException(ErrorCode.INVALID_REQUEST);
        }
        reservationRepository.delete(reservation);
    }

    public List<Reservation> getByIdAndStatus(UUID groupId, ReservationStatus status){
        return reservationRepository
                .findByGroup_IdAndStatus(groupId, status);
    }

    @Transactional
    public void changeStatus(UUID groupId, Long reservationId, UpdateStatusReservationDTO dto){
        Group group=groupRepository
                .findById(groupId)
                .orElseThrow(()->new CustomException(ErrorCode.GROUP_NOT_FOUND));
        Reservation reservation=reservationRepository
                .findByIdAndGroup_Id(reservationId, groupId)
                .orElseThrow(()->new CustomException(ErrorCode.RESERVATION_NOT_FOUND));

        if (group.getCurrentMemberCount()>=group.getMaxPeople()){
            throw new CustomException(ErrorCode.GROUP_FULL);
        }else if(reservation.status!=ReservationStatus.PENDING){
            throw new CustomException(ErrorCode.ALREADY_PROCESSED);
        }
        reservation.changeStatus(dto.status());
        group.addPeople();
    }

    public List<Reservation> getMyReservationByStatus(String token, ReservationStatus status){
        return reservationRepository.findByUser_IdAndStatus(
                UUID.fromString(tokenManager.getSubject(token)),
                status
        );
    }
}
