package com.example.Parcel.Management.System.service.impl;

import com.example.Parcel.Management.System.Utils.AuthUtil;
import com.example.Parcel.Management.System.Utils.JwtUtil;
import com.example.Parcel.Management.System.dto.common.NotificationResponseDto;
import com.example.Parcel.Management.System.dto.receptionist.ParcelResponseDto;
import com.example.Parcel.Management.System.entity.Notifications;
import com.example.Parcel.Management.System.entity.Status;
import com.example.Parcel.Management.System.repository.NotificationsRepo;
import com.example.Parcel.Management.System.repository.ParcelRepo;
import com.example.Parcel.Management.System.repository.UserRepo;
import com.example.Parcel.Management.System.service.EmployeeService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@RequiredArgsConstructor
@Service
public class EmployeeServiceImpl implements EmployeeService {

    private final ParcelRepo parcelRepo;

    private final ModelMapper modelMapper;

    private final JwtUtil jwtUtil;
    private final UserRepo userRepo;
    private final AuthUtil authUtil;
    private final SimpMessagingTemplate messagingTemplate;
    private final NotificationsRepo notificationsRepo;
    public List<ParcelResponseDto> getAllParcels(String token) {

        return parcelRepo.findByRecipient((int) userRepo.findByEmail(jwtUtil.getEmailFromToken(token))
                .orElseThrow().getId()).stream().map(parcel ->
                modelMapper.map(parcel, ParcelResponseDto.class)).toList();


    }
    public void submitResponse(Long notificationId,String status, long receptionist){
        Notifications notification = new Notifications(userRepo.findById(authUtil.getAuthorityId()).orElseThrow()
                ,userRepo.findById(authUtil.getAuthorityId()).orElseThrow().getName()+" has "+status+" the parcel."
                ,Status.valueOf(status.toUpperCase())
                ,userRepo.findById(receptionist).orElseThrow(()->new RuntimeException("no siv")));
        notification.setId(notificationId);
        notificationsRepo.save(notification);
        System.out.println("/topic/receptionist/"+userRepo.findById(receptionist).orElseThrow(()->new RuntimeException("no siv")).getEmail());
        messagingTemplate.convertAndSend("/topic/receptionist/"+userRepo.findById(receptionist).orElseThrow(()->new RuntimeException("no siv")).getEmail() , notification);
    }

    public List<NotificationResponseDto> getNotifications() {
        return notificationsRepo.findByReceiver(Math.toIntExact(authUtil.getAuthorityId()))
                .stream().map(notification->modelMapper.map(notification, NotificationResponseDto.class))
                .toList();
    }

    public Long getId() {
        return authUtil.getAuthorityId();
    }
}
