package com.example.Parcel.Management.System.service;

import com.example.Parcel.Management.System.dto.common.UsersListResponseDto;
import com.example.Parcel.Management.System.dto.receptionist.EmailDto;
import com.example.Parcel.Management.System.dto.receptionist.ParcelResponseDto;
import com.example.Parcel.Management.System.dto.receptionist.RequestParcelDto;
import com.example.Parcel.Management.System.dto.receptionist.ValidateOtpRequestDto;
import com.example.Parcel.Management.System.entity.*;
import com.example.Parcel.Management.System.repository.OtpRepo;
import com.example.Parcel.Management.System.repository.ParcelRepo;
import com.example.Parcel.Management.System.repository.UserRepo;
import com.example.Parcel.Management.System.service.impl.EmailService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReceptionistService {

    private int intOtp;

    private final ModelMapper modelMapper;
    private final UserRepo userRepo;
    private final ParcelRepo parcelRepo;
    private final OtpRepo otpRepo;
    private final EmailService emailService;
    private final BCryptPasswordEncoder encoder;

    public ParcelResponseDto createParcel(RequestParcelDto parcelDto) {
        parcelDto.setReceptionistId(1);
        System.out.println(parcelDto.getRecipientId());
        Parcel parcel = Parcel.builder().recipient(userRepo.findById(parcelDto.getRecipientId()).orElseThrow(RuntimeException::new))
        .receptionist(userRepo.findById(parcelDto.getReceptionistId()).orElseThrow(RuntimeException::new))
                .shortcode("random ").status(Status.RECEIVED).description(parcelDto.getDescription()).trackingId("random tracking Id").build();

        setOtp(parcel);

        return modelMapper.map(parcel, ParcelResponseDto.class);

    }

    private void sendMail(Parcel parcel,int otp){
        EmailDto emailDto= new EmailDto();
        emailDto.setOtp(otp);
        emailDto.setRecipientEmail(parcel.getRecipient().getEmail());
        emailDto.setShortcode(parcel.getShortcode());
        System.out.println(emailService.getEmailDetails(emailDto));
    }
    public Otp generateOtp(){
        SecureRandom random= new SecureRandom();
        Otp otp= new Otp();
        intOtp=100000 + random.nextInt(900000);
        otp.setHashedOtp(encoder.encode((Integer.toString(intOtp))));
        otp.setTimestamp(LocalDateTime.now());
        return otpRepo.save(otp);

    }

    public String validateOtp(ValidateOtpRequestDto otp){
        Parcel parcel= parcelRepo.findById(otp.getParcelId()).orElseThrow(RuntimeException::new);
//        if(parcel.getOtp().getHashedOtp()==encoder.encode(otp.getOtp()))
        if(encoder.matches(otp.getOtp(),parcel.getOtp().getHashedOtp()))
        {
            parcel.setStatus(Status.PICKED_UP);
            long otpId= parcel.getOtp().getId();
            parcel.setOtp(null);
            otpRepo.deleteById(otpId);
            parcelRepo.save(parcel);
            return "Successfully saved";
        }
        return "Wrong otp";
    }

    public String resendOtp(long parcelId) {
        Parcel parcel=parcelRepo.findById(parcelId).orElseThrow(RuntimeException::new);
        long otp = parcel.getOtp().getId();
        parcel.setOtp(null);
        otpRepo.deleteById(otp);
        setOtp(parcel);
        return "Email sent";
    }
    private void setOtp(Parcel parcel)
    {
        parcel.setOtp(generateOtp());
        parcel=parcelRepo.save(parcel);
        Otp otp = parcel.getOtp();
        otp.setParcel(parcel);
        otpRepo.save(otp);
        sendMail(parcel,intOtp);
    }


    public Page<ParcelResponseDto> getActiveParcels(int pageNumber) {
        Pageable pageable = PageRequest.of(pageNumber,3, Sort.by("id").descending());
        return parcelRepo.findByStatus(pageable,Status.RECEIVED).map(parcel ->
                modelMapper.map(parcel, ParcelResponseDto.class));
    }

    public Page<ParcelResponseDto> getParcelHistory(int pageNumber) {
        Pageable pageable = PageRequest.of(pageNumber,3, Sort.by("id").descending());
        return parcelRepo.findByStatus(pageable,Status.PICKED_UP).map(parcel ->
                modelMapper.map(parcel, ParcelResponseDto.class));
    }

    public void sendNotification(long id) {
        emailService.getNotificationDetails(userRepo.findById(id).
                orElseThrow(RuntimeException::new).getEmail());

    }

    public List<UsersListResponseDto> getAllUsers() {
        return userRepo.findAllByRole(Role.EMPLOYEE).stream()
                .map(user -> modelMapper.map(user, UsersListResponseDto.class)).toList();
    }
}
