package com.example.backend.domain.user;

import com.example.backend.domain.reservation.Reservation;
import com.example.backend.domain.reservation.ReservationRepository;
import com.example.backend.domain.reservation.ReservationStatus;
import com.example.backend.global.error.Exception.CustomException;
import com.example.backend.global.security.TokenManager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true, rollbackFor = CustomException.class, timeout = 60) //1분 이상 소요시 자동 롤백
public class UserService {
    private final UserRepository userRepository;
    private final ReservationRepository reservationRepository;
    private final TokenManager tokenManager;


    public List<User> getAllUser(){
        return userRepository.findAll();
    }
    public User getById(UUID id){
        return userRepository.findById(id).orElseThrow();
    }

    @Transactional
    public void changeNickname(String token, String nickname){
        User user=userRepository.findById(
                UUID.fromString(
                        tokenManager.getSubject(token)
                )
        ).orElseThrow();
        user.changeNickname(nickname);
    }

    @Transactional
    public void deleteUser(String token){
        User user=userRepository.findById(
                UUID.fromString(
                        tokenManager.getSubject(token)
                )
        ).orElseThrow();
        List<Reservation> temp=reservationRepository.findAllByUser_IdAndStatus(user.getId(), ReservationStatus.APPROVED);
        for(Reservation reservation:temp){
            reservation.getGroup().minersPeople();
        }
        userRepository.delete(user);
    }
}
