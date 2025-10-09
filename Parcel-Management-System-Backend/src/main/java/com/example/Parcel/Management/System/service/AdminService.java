package com.example.Parcel.Management.System.service;

import com.example.Parcel.Management.System.dto.admin.UpdateRoleRequest;
import com.example.Parcel.Management.System.dto.common.UserDetailResponseDto;
import com.example.Parcel.Management.System.dto.receptionist.GenericAopDto;
import com.example.Parcel.Management.System.dto.receptionist.ParcelResponseDto;
import com.example.Parcel.Management.System.entity.Role;

import java.util.List;

public interface AdminService {
    public List<UserDetailResponseDto> getAllUsers();

    public List<ParcelResponseDto> getAllParcels();

    public List<UserDetailResponseDto> updateUserRole(List<UpdateRoleRequest> list);

}
