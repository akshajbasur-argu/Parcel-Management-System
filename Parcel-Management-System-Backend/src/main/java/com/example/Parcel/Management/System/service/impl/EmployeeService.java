package com.example.Parcel.Management.System.service.impl;

import aj.org.objectweb.asm.commons.Remapper;
import com.example.Parcel.Management.System.Utils.JwtUtil;
import com.example.Parcel.Management.System.dto.receptionist.ParcelResponseDto;
import com.example.Parcel.Management.System.entity.User;
import com.example.Parcel.Management.System.repository.ParcelRepo;
import com.example.Parcel.Management.System.repository.UserRepo;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
@RequiredArgsConstructor
@Service
public class EmployeeService {

    private final ParcelRepo parcelRepo;

    private final ModelMapper modelMapper;

    private final JwtUtil jwtUtil;
    private final UserRepo userRepo;

public List<ParcelResponseDto> getAllParcels(String token) {

    return parcelRepo.findByRecipient((int)userRepo.findByEmail(jwtUtil.getEmailFromToken(token)).orElseThrow().getId()).stream().map(parcel ->
            modelMapper.map(parcel, ParcelResponseDto.class)).toList();


}
}