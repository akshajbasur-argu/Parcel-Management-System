package com.example.Parcel.Management.System.service;

import com.example.Parcel.Management.System.dto.EmailDto;
import com.example.Parcel.Management.System.dto.ParcelResponseDto;
import com.example.Parcel.Management.System.dto.RequestParcelDto;
import com.example.Parcel.Management.System.entity.Otp;
import com.example.Parcel.Management.System.entity.Parcel;
import com.example.Parcel.Management.System.entity.Status;
import com.example.Parcel.Management.System.repository.OtpRepo;
import com.example.Parcel.Management.System.repository.ParcelRepo;
import com.example.Parcel.Management.System.repository.UserRepo;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class ReceptionistService {

    private final ModelMapper modelMapper;
    private final UserRepo userRepo;
    private final ParcelRepo parcelRepo;
    private final OtpRepo otpRepo;
    private final EmailService emailService;

    public  ParcelResponseDto createParcel(RequestParcelDto parcelDto)
    {
        Parcel parcel = new Parcel();
        System.out.println("1");
        System.out.println(parcelDto.getReceptionistId());
        parcel.setRecipient(userRepo.findById(parcelDto.getRecipientId()).orElseThrow(RuntimeException::new));
        System.out.println("2");
        parcel.setReceptionist(userRepo.findById(parcelDto.getReceptionistId()).orElseThrow(RuntimeException::new));
        System.out.println("3");
        parcel.setOtp(generateOtp());
        parcel.setShortcode("random ");
        parcel.setStatus(Status.RECIEVED);
        parcel.setDescription(parcelDto.getDescription());
        parcel.setTrackingId("random tracking Id");
        parcel=parcelRepo.save(parcel);
        Otp otp = parcel.getOtp();
        otp.setParcel(parcel);
        otpRepo.save(otp);

        EmailDto emailDto= new EmailDto();
        emailDto.setOtp(parcel.getOtp().getHashedOtp());
        emailDto.setRecipientEmail(parcel.getRecipient().getEmail());
        emailDto.setShortcode(parcel.getShortcode());
        System.out.println(emailService.getEmailDetails(emailDto));
        return modelMapper.map(parcel, ParcelResponseDto.class);

    }

    public Otp generateOtp(){
        Random random= new Random();
        Otp otp= new Otp();
        otp.setHashedOtp(Integer.toString(100000 + random.nextInt(900000)));
        otp.setTimestamp(LocalDateTime.now());
        return otpRepo.save(otp);

    }
}
