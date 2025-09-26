package com.example.Parcel.Management.System.service.impl;

import com.example.Parcel.Management.System.dto.common.UserDetailResponseDto;
import com.example.Parcel.Management.System.entity.Role;
import com.example.Parcel.Management.System.entity.User;
import com.example.Parcel.Management.System.repository.UserRepo;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final ModelMapper modelMapper;
    @Autowired
    private UserRepo userRepo;

    public List<UserDetailResponseDto> getAllUsers() {
        return userRepo.findAll().stream().map(user -> modelMapper.map(user, UserDetailResponseDto.class)).toList();
    }

    public User updateUserRole(long id, Role role) {
        User user = userRepo.findById(id).orElseThrow(() -> new RuntimeException("USER NOT Found"));
        user.setRole(role);
        return userRepo.save(user);
    }
}
