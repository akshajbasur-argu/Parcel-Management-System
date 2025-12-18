package com.example.Parcel.Management.System.service;

import com.example.Parcel.Management.System.dto.receptionist.ParcelResponseDto;
import com.example.Parcel.Management.System.entity.Status;
import org.springframework.data.domain.Page;

import java.util.List;

public interface EmployeeService {
    public List<ParcelResponseDto> getAllParcels(String token);

    void submitResponse(Long notificationId,String status, long receptionist);

    Page<ParcelResponseDto> getPaginatedParcels(int page, int size, Status filter);
}
