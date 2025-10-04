package com.example.Parcel.Management.System.service;

import com.example.Parcel.Management.System.dto.receptionist.ParcelResponseDto;

import java.util.List;

public interface EmployeeService {
    public List<ParcelResponseDto> getAllParcels(String token) ;

    }
