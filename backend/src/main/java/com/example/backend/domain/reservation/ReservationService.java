package com.example.backend.domain.reservation;

import com.example.backend.domain.group.Group;
import com.example.backend.domain.group.repository.GroupRepository;
import com.example.backend.domain.reservation.controller.dto.request.CreateReservationDTO;
import com.example.backend.domain.reservation.controller.dto.request.UpdateStatusReservationDTO;
import com.example.backend.domain.reservation.controller.dto.response.ReadGroupDTO;
import com.example.backend.domain.reservation.controller.dto.response.ReadGroupMembersDTO;
import com.example.backend.domain.user.User;
import com.example.backend.domain.user.UserRepository;
import com.example.backend.global.error.Exception.CustomException;
import com.example.backend.global.error.Exception.ErrorCode;
import com.example.backend.global.security.TokenManager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true, timeout = 60, rollbackFor = CustomException.class)
public class ReservationService {
    private final ReservationRepository reservationRepository;
    private final UserRepository userRepository;
    private final GroupRepository groupRepository;
    private final TokenManager tokenManager;

    @Transactional
    public Reservation createReservation(CreateReservationDTO dto, String token, UUID groupId){
        Group group=groupRepository
                .findById(groupId)
                .orElseThrow(()-> new CustomException(ErrorCode.GROUP_NOT_FOUND));
        User user=userRepository
                .findById(UUID.fromString(tokenManager.getSubject(token)))
                .orElseThrow(()-> new CustomException(ErrorCode.USER_NOT_FOUND));
        //예외처리
        UUID hostId=group.getCreateUser().getId();
        if(hostId.equals(user.getId())&&dto.role()!=RoleEnum.HOST){ //본인의 모임에 신청
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
                .role(dto.role())
                .build();
        reservationRepository.save(reservation);
        return reservation;
    }

    //요청 취소 (대기 상태)
    @Transactional
    public void deleteReservation(UUID groupId, String token){
        Reservation reservation=reservationRepository
                .findByUser_IdAndGroup_Id(
                        UUID.fromString(tokenManager.getSubject(token)),
                        groupId
                )
                .orElseThrow(()->new CustomException(ErrorCode.RESERVATION_NOT_FOUND));
        if(reservation.status==ReservationStatus.PENDING){
            reservationRepository.delete(reservation);
        }
        else{
            throw new CustomException(ErrorCode.INVALID_REQUEST);
        }
    }

    public List<Reservation> getByIdAndStatus(UUID groupId, ReservationStatus status){
        return reservationRepository
                .findAllByGroup_IdAndStatus(groupId, status);
    }

    @Transactional
    public void changeStatus(UUID groupId, Long reservationId, UpdateStatusReservationDTO dto){
        Group group=groupRepository
                .findById(groupId)
                .orElseThrow(()->new CustomException(ErrorCode.GROUP_NOT_FOUND));
        Reservation reservation=reservationRepository
                .findByIdAndGroup_Id(reservationId, groupId)
                .orElseThrow(()->new CustomException(ErrorCode.RESERVATION_NOT_FOUND));

        if (group.getCurrentMemberCount()>=group.getMaxPeople() && dto.status().equals(ReservationStatus.APPROVED)){
            throw new CustomException(ErrorCode.GROUP_FULL);
        }else if(reservation.status!=ReservationStatus.PENDING){
            throw new CustomException(ErrorCode.ALREADY_PROCESSED);
        }
        reservation.changeStatus(dto.status());
        if (dto.status().equals(ReservationStatus.APPROVED)) {
            group.addPeople();
        }
    }

    //상태 기반 자신의 신청 목록 전체 조회
    public List<Reservation> getMyReservationByStatus(String token, ReservationStatus status){
        return reservationRepository.findAllByUser_IdAndStatus(
                UUID.fromString(tokenManager.getSubject(token)),
                status
        );
    }

    //각 그룹의 상태에 따른 맴버 조회
    public List<ReadGroupMembersDTO> getAllGroupMembersByStatus(
            UUID groupId,
            ReservationStatus status
    ){
        List<Reservation> list=reservationRepository.findAllByGroup_IdAndStatus(groupId, status);
        return list.stream()
                .map(temp -> ReadGroupMembersDTO.builder()
                        .joinAt(temp.requestedAt)
                        .userNickname(temp.userNickname)
                        .userId(temp.user.getId())
                        .build()
                )
                .toList();
    }

    //자신이 가입이 완료된 모임의 참여자 조회
    public List<ReadGroupMembersDTO> getMyGroupMembers(UUID groupId, String token){
        Reservation reservation=reservationRepository
                .findByUser_IdAndGroup_Id(
                        UUID.fromString(tokenManager.getSubject(token)),
                        groupId
                ).orElseThrow(()->new CustomException(ErrorCode.RESERVATION_NOT_FOUND));
        if(reservation.status!=ReservationStatus.APPROVED){
            throw new CustomException(ErrorCode.FORBIDDEN);
        }
        return getAllGroupMembersByStatus(groupId, ReservationStatus.APPROVED);
    }

    public List<ReadGroupDTO> getMyGroup(String token, RoleEnum role){
        UUID userId=UUID.fromString(tokenManager.getSubject(token));
        List<Reservation> list;
        if(role==null){
            list=reservationRepository.findAllByUser_Id(userId);
        }
        else if(RoleEnum.HOST.equals(role)){
            list=reservationRepository.findAllByRoleAndUser_Id(role, userId);
        }
        else{
            list=reservationRepository.findAllByUser_IdAndRoleAndStatus(userId, role, ReservationStatus.APPROVED);
        }
        return list.stream()
                .map(reservation-> ReadGroupDTO.builder()
                        .id(reservation.getGroup().getId())
                        .title(reservation.getGroup().getTitle())
                        .content(reservation.getGroup().getContent())
                        .role(reservation.getRole())
                        .members(
                                reservationRepository.findAllByGroup_IdAndStatus(reservation.group.getId(), ReservationStatus.APPROVED).stream()
                                        .map(temp -> ReadGroupMembersDTO.builder()
                                                .joinAt(temp.requestedAt)
                                                .userNickname(temp.userNickname)
                                                .userId(temp.user.getId())
                                                .build()
                                        )
                                        .toList()
                        ).build()
                )
                .toList();
    }
}
