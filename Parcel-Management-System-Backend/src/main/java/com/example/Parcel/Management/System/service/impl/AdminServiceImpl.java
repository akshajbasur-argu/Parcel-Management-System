package com.example.Parcel.Management.System.service.impl;

import com.example.Parcel.Management.System.Utils.JwtUtil;
import com.example.Parcel.Management.System.dto.admin.UpdateRoleRequest;
import com.example.Parcel.Management.System.dto.common.UserDetailResponseDto;
import com.example.Parcel.Management.System.dto.receptionist.GenericAopDto;
import com.example.Parcel.Management.System.dto.receptionist.ParcelResponseDto;
import com.example.Parcel.Management.System.entity.Role;
import com.example.Parcel.Management.System.entity.User;
import com.example.Parcel.Management.System.repository.ParcelRepo;
import com.example.Parcel.Management.System.repository.UserRepo;
import com.example.Parcel.Management.System.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.hibernate.dialect.unique.CreateTableUniqueDelegate;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final ModelMapper modelMapper;
    @Autowired
    private UserRepo userRepo;
    @Autowired
    private ParcelRepo parcelRepo;

    private final JwtUtil jwtUtil;
    public List<UserDetailResponseDto> getAllUsers(String token) {

        UserDetailResponseDto admin=modelMapper.map(userRepo.findByEmail(jwtUtil.getEmailFromToken(token))
                .orElseThrow(()->new UsernameNotFoundException("No User found")),UserDetailResponseDto.class);

        List<UserDetailResponseDto> list = new java.util.ArrayList<>(userRepo.findAll().stream()
                .map(user -> modelMapper.map(user, UserDetailResponseDto.class))
                .toList());
        list.remove(admin);
        return list;

    }

    public List<ParcelResponseDto> getAllParcels() {
        return parcelRepo.findAll().stream().map(parcel ->
                modelMapper.map(parcel, ParcelResponseDto.class)).toList();
    }

    public List<UserDetailResponseDto> updateUserRole(List<UpdateRoleRequest> list,String token) {
        list.forEach(update ->changeRole(update,token));

        return getAllUsers(token);
    }
    public UserDetailResponseDto changeRole(UpdateRoleRequest update, String token)
    {
        User user = userRepo.findById(update.getId())
                .orElseThrow(()->new RuntimeException("User Not Found with id: "+ update.getId()));

        String oldRole = user.getRole().name();
        user.setRole(update.getRole());
        userRepo.save(user);

        return new UserDetailResponseDto(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole()
        );
    }
}
//        User user= userRepo.findById(id).orElseThrow(() -> new RuntimeException("USER NOT Found"));
//        String oldRole = user.getRole().name();
//        user.setRole(role);
//        userRepo.save(user);
//        return GenericAopDto.builder().recipientName(user.getName())
//                .receptionistId(userRepo.findByEmail(jwtUtil.getEmailFromToken(token)).orElseThrow().getId())
//                .employeeId(user.getId())
//                .status("Successfully changed user role from "+oldRole+" to "+role.name()).build();