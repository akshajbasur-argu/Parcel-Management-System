package com.example.Parcel.Management.System.service;

import com.example.Parcel.Management.System.dto.common.NotificationResponseDto;
import com.example.Parcel.Management.System.dto.common.UsersListResponseDto;
import com.example.Parcel.Management.System.dto.receptionist.GenericAopDto;
import com.example.Parcel.Management.System.dto.receptionist.ParcelResponseDto;
import com.example.Parcel.Management.System.dto.receptionist.RequestParcelDto;
import com.example.Parcel.Management.System.dto.receptionist.ValidateOtpRequestDto;
import com.example.Parcel.Management.System.entity.Notifications;
import org.springframework.data.domain.Page;

import java.util.List;

public interface ReceptionistService {


    Page<UsersListResponseDto> getPaginatedUsers(int page, int size, String search);

    public ParcelResponseDto createParcel(RequestParcelDto parcelDto);

    public GenericAopDto validateOtp(ValidateOtpRequestDto otp);

    public GenericAopDto resendOtp(long parcelId);

    public Page<ParcelResponseDto> getActiveParcels(int pageNumber);

    public Page<ParcelResponseDto> getParcelHistory(int pageNumber);

    public GenericAopDto sendNotification(long id, String message);

    public List<UsersListResponseDto> getAllUsers();

    public List<NotificationResponseDto> getNotifications();

    public void changeStatus(long id);
}
