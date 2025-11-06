package com.example.Parcel.Management.System.service;

import com.example.Parcel.Management.System.dto.common.UsersListResponseDto;
import com.example.Parcel.Management.System.dto.receptionist.GenericAopDto;
import com.example.Parcel.Management.System.dto.receptionist.ParcelResponseDto;
import com.example.Parcel.Management.System.dto.receptionist.RequestParcelDto;
import com.example.Parcel.Management.System.dto.receptionist.ValidateOtpRequestDto;
import org.springframework.data.domain.Page;

import java.util.List;

public interface ReceptionistService {
    public ParcelResponseDto createParcel(RequestParcelDto parcelDto);

    public GenericAopDto validateOtp(ValidateOtpRequestDto otp);

    public GenericAopDto resendOtp(long parcelId);

    public Page<ParcelResponseDto> getActiveParcels(int pageNumber);

    public Page<ParcelResponseDto> getParcelHistory(int pageNumber);

    public GenericAopDto sendNotification(long id);

    public List<UsersListResponseDto> getAllUsers();
}
