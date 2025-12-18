package com.example.Parcel.Management.System.service.impl;

import com.example.Parcel.Management.System.Utils.AuthUtil;
import com.example.Parcel.Management.System.Utils.JwtUtil;
import com.example.Parcel.Management.System.dto.admin.ParcelStatusUpdateDto;
import com.example.Parcel.Management.System.dto.admin.UpdateStatusRequest;
import com.example.Parcel.Management.System.dto.common.NotificationResponseDto;
import com.example.Parcel.Management.System.dto.receptionist.ParcelResponseDto;
import com.example.Parcel.Management.System.dto.receptionist.RequestParcelDto;
import com.example.Parcel.Management.System.entity.Notifications;
import com.example.Parcel.Management.System.entity.Parcel;
import com.example.Parcel.Management.System.entity.Status;
import com.example.Parcel.Management.System.repository.NotificationsRepo;
import com.example.Parcel.Management.System.repository.OtpRepo;
import com.example.Parcel.Management.System.repository.ParcelRepo;
import com.example.Parcel.Management.System.repository.UserRepo;
import com.example.Parcel.Management.System.service.EmployeeService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;

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
    private final ReceptionistServiceImpl receptionistService;
    private final OtpRepo otpRepo;
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




        if (status.equals("accepted")){
            Notifications oldNotification = notificationsRepo.findById(notificationId).orElseThrow();
            RequestParcelDto parcelDto = new RequestParcelDto();
            //EXTRACT COMPANY NAME
            String message = oldNotification.getMessage();
            int startIndexCompany = message.indexOf("m ") + 2;
            int endIndexCompany = message.indexOf(" w", startIndexCompany);
            String company = message.substring(startIndexCompany, endIndexCompany);

            // Extract orderId
            int startIndexOrderId = message.indexOf(": ", endIndexCompany) + 2;
            int endIndexOrderId = message.indexOf(" r", startIndexOrderId);
            String orderId = message.substring(startIndexOrderId, endIndexOrderId);

            parcelDto.setShortcode(orderId);
            parcelDto.setDescription(company);
            parcelDto.setRecipientId(authUtil.getAuthorityId());
            parcelDto.setName(userRepo.findById(authUtil.getAuthorityId()).orElseThrow().getName());

            createParcel(parcelDto);
        }




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

    private void createParcel(RequestParcelDto requestParcelDto){
        receptionistService.createParcel(requestParcelDto);
    }

    public void updateParcelStatus(List<UpdateStatusRequest> updates) {
        updates.forEach(this::changeStatus);
    }

    public ParcelStatusUpdateDto changeStatus(UpdateStatusRequest update) {
        Parcel parcel = parcelRepo.findById(update.getId())
                .orElseThrow(() -> new RuntimeException("Parcel Not Found with id: " + update.getId()));
        if (parcel.getStatus().name().equals(Status.RECEIVED.name())) {
            Status oldStatus = parcel.getStatus();
            parcel.setStatus(update.getStatus());
            long otpId = parcel.getOtp().getId();
            parcel.setOtp(null);
            otpRepo.deleteById(otpId);
            System.out.println(parcelRepo.save(parcel));

            return new ParcelStatusUpdateDto(
                    parcel.getId(),
                    parcel.getName(),
                    parcel.getShortcode(),
                    parcel.getDescription(),
                    parcel.getStatus(),
                    oldStatus,
                    parcel.getCreatedAt(),
                    authUtil.getAuthorityId()
            );
        }
        return null;
    }

    @Override
    public Page<ParcelResponseDto> getPaginatedParcels(int page, int size, Status filter){
        Pageable pageable = PageRequest.of(page,size, Sort.by("id").descending());
        Page<Parcel> parcelPage =
                (filter == null)
                        ?parcelRepo.findAll(pageable)
                        :parcelRepo.findByStatus(pageable,filter);

        return parcelPage.map(parcel -> modelMapper.map(parcel,ParcelResponseDto.class));

    }
}
