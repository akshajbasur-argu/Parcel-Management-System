package com.example.Parcel.Management.System.service.impl;

import com.example.Parcel.Management.System.Utils.JwtUtil;
import com.example.Parcel.Management.System.dto.common.UsersListResponseDto;
import com.example.Parcel.Management.System.dto.receptionist.*;
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
    private final JwtUtil jwtUtil;

    public ParcelResponseDto createParcel(RequestParcelDto parcelDto, String header) {
        parcelDto.setReceptionistId(1);
        Parcel parcel = Parcel.builder().recipient(userRepo.findById(parcelDto.getRecipientId()).orElseThrow(RuntimeException::new))
        .receptionist(userRepo.findById(getReceptionistId(header)).orElseThrow(RuntimeException::new))
                .shortcode("random ").status(Status.RECEIVED).description(parcelDto.getDescription()).trackingId("random tracking Id").build();

        setOtp(parcel);

        ParcelResponseDto parcelResponseDto= modelMapper.map(parcel, ParcelResponseDto.class);
        parcelResponseDto.setReceptionistId(getReceptionistId(header));
        parcelResponseDto.setEmployeeId(parcel.getRecipient().getId());
        return parcelResponseDto;

    }

    private long getReceptionistId(String token){
        return userRepo.findByEmail(jwtUtil.getEmailFromToken(token)).orElseThrow().getId();

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

    public GenericAopDto validateOtp(ValidateOtpRequestDto otp, String header){
        Parcel parcel= parcelRepo.findById(otp.getParcelId()).orElseThrow(RuntimeException::new);
//        if(parcel.getOtp().getHashedOtp()==encoder.encode(otp.getOtp()))
        long receptionistId= getReceptionistId(header);
        if(encoder.matches(otp.getOtp(),parcel.getOtp().getHashedOtp()))
            {
                parcel.setStatus(Status.PICKED_UP);
                long otpId= parcel.getOtp().getId();
                parcel.setOtp(null);
                otpRepo.deleteById(otpId);
                parcelRepo.save(parcel);
                return GenericAopDto.builder().recipientName(parcel.getRecipient().getName())
                        .receptionistId(receptionistId)
                        .employeeId(parcel.getRecipient().getId())
                        .status("Successfull" ).build();

            }
            return GenericAopDto.builder().recipientName(parcel.getRecipient().getName())
                    .receptionistId(receptionistId)
                    .employeeId(parcel.getRecipient().getId())
                    .status("Failed" ).build();
        }


    public GenericAopDto resendOtp(long parcelId, String header) {
        Parcel parcel=parcelRepo.findById(parcelId).orElseThrow(RuntimeException::new);
        long otp = parcel.getOtp().getId();
        parcel.setOtp(null);
        otpRepo.deleteById(otp);
        setOtp(parcel);
        return GenericAopDto.builder().receptionistId(getReceptionistId(header))
                .recipientName(parcel.getRecipient().getName())
                .employeeId(parcel.getRecipient().getId())
                .status("Succesfull").build();
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

    public GenericAopDto sendNotification(long id , String header) {

        emailService.getNotificationDetails(userRepo.findById(id).
                orElseThrow(RuntimeException::new).getEmail());
        return GenericAopDto.builder().receptionistId(getReceptionistId(header))
                .recipientName(userRepo.findById(id).orElseThrow().getName())
                .employeeId(id).status("successfull").build();
    }

    public List<UsersListResponseDto> getAllUsers() {
        return userRepo.findAllByRole(Role.EMPLOYEE).stream()
                .map(user -> modelMapper.map(user, UsersListResponseDto.class)).toList();
    }
}
