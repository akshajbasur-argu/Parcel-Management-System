package com.example.Parcel.Management.System.service.impl;

import com.example.Parcel.Management.System.Utils.JwtUtil;
import com.example.Parcel.Management.System.dto.receptionist.ParcelResponseDto;
import com.example.Parcel.Management.System.repository.ParcelRepo;
import com.example.Parcel.Management.System.repository.UserRepo;
import com.example.Parcel.Management.System.service.EmployeeService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class EmployeeServiceImpl implements EmployeeService {

    private final ParcelRepo parcelRepo;

    private final ModelMapper modelMapper;

    private final JwtUtil jwtUtil;
    private final UserRepo userRepo;

    public List<ParcelResponseDto> getAllParcels(String token) {

        return parcelRepo.findByRecipient((int) userRepo.findByEmail(jwtUtil.getEmailFromToken(token))
                .orElseThrow().getId()).stream().map(parcel ->
                modelMapper.map(parcel, ParcelResponseDto.class)).toList();


    }
}
