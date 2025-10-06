package com.example.Parcel.Management.System.service.impl;

import com.example.Parcel.Management.System.Utils.JwtUtil;
import com.example.Parcel.Management.System.dto.admin.UpdateRoleRequest;
import com.example.Parcel.Management.System.dto.admin.UserRoleUpdateDto;
import com.example.Parcel.Management.System.dto.common.UserDetailResponseDto;
import com.example.Parcel.Management.System.dto.receptionist.ParcelResponseDto;
import com.example.Parcel.Management.System.entity.Role;
import com.example.Parcel.Management.System.entity.User;
import com.example.Parcel.Management.System.repository.ParcelRepo;
import com.example.Parcel.Management.System.repository.UserRepo;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl {
    private final UpdateRole updateRole;
    private final ModelMapper modelMapper;
    private final JwtUtil jwtUtil;

    private final UserRepo userRepo;

    private final ParcelRepo parcelRepo;

    public List<UserDetailResponseDto> getAllUsers(String token) {

        UserDetailResponseDto admin = modelMapper.map(userRepo.findByEmail(jwtUtil.getEmailFromToken(token))
                .orElseThrow(() -> new UsernameNotFoundException("No User found")), UserDetailResponseDto.class);

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

    public List<UserDetailResponseDto> updateUserRole(List<UpdateRoleRequest> list, String token) {
        list.forEach(update -> updateRole.changeRole(update, token));

        return getAllUsers(token);
    }


}
@Service
@RequiredArgsConstructor
class UpdateRole{
    private final UserRepo userRepo;
    private final JwtUtil jwtUtil;
    public UserRoleUpdateDto changeRole(UpdateRoleRequest update, String token) {
        User user = userRepo.findById(update.getId())
                .orElseThrow(() -> new RuntimeException("User Not Found with id: " + update.getId()));

        Role oldRole = user.getRole();
        user.setRole(update.getRole());
        userRepo.save(user);

        return new UserRoleUpdateDto(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                oldRole,
                userRepo.findByEmail(jwtUtil.getEmailFromToken(token)).orElseThrow().getId()
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