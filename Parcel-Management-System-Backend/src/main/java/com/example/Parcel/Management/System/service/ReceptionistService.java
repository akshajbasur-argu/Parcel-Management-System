package com.example.Parcel.Management.System.service;

import com.example.Parcel.Management.System.dto.*;
import com.example.Parcel.Management.System.entity.Otp;
import com.example.Parcel.Management.System.entity.Parcel;
import com.example.Parcel.Management.System.entity.Status;
import com.example.Parcel.Management.System.entity.User;
import com.example.Parcel.Management.System.repository.OtpRepo;
import com.example.Parcel.Management.System.repository.ParcelRepo;
import com.example.Parcel.Management.System.repository.UserRepo;
import lombok.RequiredArgsConstructor;
import org.aspectj.apache.bcel.classfile.annotation.RuntimeInvisAnnos;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
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

        parcel.setRecipient(userRepo.findById(parcelDto.getRecipientId()).orElseThrow(RuntimeException::new));
        parcel.setReceptionist(userRepo.findById(parcelDto.getReceptionistId()).orElseThrow(RuntimeException::new));
        parcel.setShortcode("random ");
        parcel.setStatus(Status.RECEIVED);
        parcel.setDescription(parcelDto.getDescription());
        parcel.setTrackingId("random tracking Id");
        setOtp(parcel);

        return modelMapper.map(parcel, ParcelResponseDto.class);

    }

    private void sendMail(Parcel parcel){
        EmailDto emailDto= new EmailDto();
        emailDto.setOtp(parcel.getOtp().getHashedOtp());
        emailDto.setRecipientEmail(parcel.getRecipient().getEmail());
        emailDto.setShortcode(parcel.getShortcode());
        System.out.println(emailService.getEmailDetails(emailDto));
    }
    public Otp generateOtp(){
        Random random= new Random();
        Otp otp= new Otp();
        otp.setHashedOtp(Integer.toString(100000 + random.nextInt(900000)));
        otp.setTimestamp(LocalDateTime.now());
        return otpRepo.save(otp);

    }

    public String validateOtp(ValidateOtpRequestDto otp){
        Parcel parcel= parcelRepo.findById(otp.getParcelId()).orElseThrow(RuntimeException::new);
        if(parcel.getOtp().getHashedOtp()==otp.getOtp())
        {
            parcel.setStatus(Status.PICKED_UP);
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
        sendMail(parcel);
    }


    public List<ParcelResponseDto> getAllParcels() {
        return parcelRepo.findAll().stream().map(parcel ->
                modelMapper.map(parcel, ParcelResponseDto.class)).toList();
    }

    public void sendNotification(long id) {
        emailService.getNotificationDetails(userRepo.findById(id).
                orElseThrow(RuntimeException::new).getEmail());



    }
}
