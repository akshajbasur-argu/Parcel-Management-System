package com.example.Parcel.Management.System.service.impl;

import com.example.Parcel.Management.System.Utils.AuthUtil;
import com.example.Parcel.Management.System.Utils.JwtUtil;
import com.example.Parcel.Management.System.dto.common.NotificationResponseDto;
import com.example.Parcel.Management.System.dto.common.UsersListResponseDto;
import com.example.Parcel.Management.System.dto.receptionist.*;
import com.example.Parcel.Management.System.entity.*;
import com.example.Parcel.Management.System.exceptions.GlobalExceptionHandler;
import com.example.Parcel.Management.System.exceptions.InvalidRequestException;
import com.example.Parcel.Management.System.repository.NotificationsRepo;
import com.example.Parcel.Management.System.repository.OtpRepo;
import com.example.Parcel.Management.System.repository.ParcelRepo;
import com.example.Parcel.Management.System.repository.UserRepo;
import com.example.Parcel.Management.System.service.ReceptionistService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.CookieValue;

import javax.management.Notification;
import java.security.SecureRandom;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReceptionistServiceImpl implements ReceptionistService {

    private final ModelMapper modelMapper;
    private final UserRepo userRepo;
    private final ParcelRepo parcelRepo;
    private final OtpRepo otpRepo;
    private final EmailServiceImpl emailService;
    private final BCryptPasswordEncoder encoder;
    private final JwtUtil jwtUtil;
    private int intOtp;
    private final AuthUtil authUtil;
    private final SimpMessagingTemplate messagingTemplate;
    private final NotificationsRepo notificationsRepo;

    public ParcelResponseDto createParcel(RequestParcelDto parcelDto) {
        Parcel parcel = Parcel.builder().recipient(userRepo.findById(parcelDto.getRecipientId()).orElseThrow(() -> new UsernameNotFoundException("User not Found")))
                .receptionist(userRepo.findById(authUtil.getAuthorityId()).orElseThrow(() -> new UsernameNotFoundException("Receptionist not found")))
                .shortcode(parcelDto.getShortcode()).status(Status.RECEIVED).description(parcelDto.getDescription()).trackingId("random tracking Id")
                .name(parcelDto.getName())
                .createdAt(Timestamp.valueOf(LocalDateTime.now()))
                .build();


        setOtp(parcel);

        ParcelResponseDto parcelResponseDto = modelMapper.map(parcel, ParcelResponseDto.class);

        parcelResponseDto.setEmployeeId(parcel.getRecipient().getId());
        return parcelResponseDto;

    }

    private long getReceptionistId(String token) {
        return userRepo.findByEmail(jwtUtil.getEmailFromToken(token)).orElseThrow(() -> new InvalidRequestException("Wrong Email")).getId();

    }

    private void sendMail(Parcel parcel, int otp) {
        EmailDto emailDto = new EmailDto();
        emailDto.setOtp(otp);
        emailDto.setRecipientEmail(parcel.getRecipient().getEmail());
        emailDto.setShortcode(parcel.getShortcode());
        System.out.println(emailService.getEmailDetails(emailDto));
    }

    public Otp generateOtp() {
        SecureRandom random = new SecureRandom();
        Otp otp = new Otp();
        intOtp = 100000 + random.nextInt(900000);
        otp.setHashedOtp(encoder.encode((Integer.toString(intOtp))));
        otp.setTimestamp(LocalDateTime.now());
        return otpRepo.save(otp);

    }

    public GenericAopDto validateOtp(ValidateOtpRequestDto otp) {
        Parcel parcel = parcelRepo.findById(otp.getParcelId()).orElseThrow(() -> new InvalidRequestException("Parcel does not exist"));
//        if(parcel.getOtp().getHashedOtp()==encoder.encode(otp.getOtp()))
        if (encoder.matches(otp.getOtp(), parcel.getOtp().getHashedOtp())) {
            parcel.setStatus(Status.PICKED_UP);
            long otpId = parcel.getOtp().getId();
            parcel.setOtp(null);
            otpRepo.deleteById(otpId);
            parcelRepo.save(parcel);
            return GenericAopDto.builder().recipientName(parcel.getRecipient().getName())
                    .employeeId(parcel.getRecipient().getId())
                    .status("Successfull").build();

        }
        else {
            throw new InvalidRequestException("Invalid Otp");
        }
//        return GenericAopDto.builder().recipientName(parcel.getRecipient().getName())
//                .receptionistId(receptionistId)
//                .employeeId(parcel.getRecipient().getId())
//                .status("Failed").build();
    }


    public GenericAopDto resendOtp(long parcelId) {
        Parcel parcel = parcelRepo.findById(parcelId).orElseThrow(() -> new InvalidRequestException("Parcel does not exist"));
        long otp = parcel.getOtp().getId();
        parcel.setOtp(null);
        otpRepo.deleteById(otp);
        setOtp(parcel);
        return GenericAopDto.builder()
                .recipientName(parcel.getRecipient().getName())
                .employeeId(parcel.getRecipient().getId())
                .status("Succesfull").build();
    }

    private void setOtp(Parcel parcel) {
        parcel.setOtp(generateOtp());
        parcel = parcelRepo.save(parcel);
        Otp otp = parcel.getOtp();
        otp.setParcel(parcel);
        otpRepo.save(otp);
        sendMail(parcel, intOtp);
    }


    public Page<ParcelResponseDto> getActiveParcels(int pageNumber) {
        Pageable pageable = PageRequest.of(pageNumber, 10, Sort.by("id").descending());

        return parcelRepo.findByStatus(pageable, Status.RECEIVED).map(parcel ->
                modelMapper.map(parcel, ParcelResponseDto.class));
    }

    public Page<ParcelResponseDto> getParcelHistory(int pageNumber) {
        Pageable pageable = PageRequest.of(pageNumber, 10, Sort.by("id").descending());
        return parcelRepo.findByStatus(pageable, Status.PICKED_UP).map(parcel ->
                modelMapper.map(parcel, ParcelResponseDto.class));
    }

    public GenericAopDto sendNotification(long id,String message) {
        User user = userRepo.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with id: " + id));

        String email = user.getEmail();
        String name = user.getName();

        emailService.getNotificationDetails(email);


        Notifications notification = new Notifications(
                userRepo.findById(authUtil.getAuthorityId()).orElseThrow()
                ,message
                ,Status.PENDING
                ,userRepo.findById(id).orElseThrow()
        );
        notificationsRepo.save(notification);



        messagingTemplate.convertAndSend("/topic/employee/" + id, notification);

        return GenericAopDto.builder()
                .recipientName(name)
                .employeeId(id)
                .status("successful")
                .build();


    }

    public List<UsersListResponseDto> getAllUsers() {
//        return userRepo.findAllByRole(Role.EMPLOYEE).stream()
//                .map(user -> modelMapper.map(user, UsersListResponseDto.class)).toList();
        List<UsersListResponseDto> list= new ArrayList<>();
        userRepo.findAll().forEach(user -> {
            if (user.getRole() != Role.RECEPTIONIST)
                list.add(modelMapper.map(user, UsersListResponseDto.class));
        });
        return list;
    }
    public List<NotificationResponseDto> getNotifications(){
        return notificationsRepo.findByReceiver(Math.toIntExact(authUtil.getAuthorityId()))
                .stream().map(notification -> modelMapper.map(notification, NotificationResponseDto.class))
                .toList();
    }
    public void changeStatus(long id){
        Notifications notification= notificationsRepo.findById(id).orElseThrow();
        notification.setStatus(Status.COMPLETED);
        notificationsRepo.save(notification);

    }
}
