package com.example.Parcel.Management.System.service;

import com.example.Parcel.Management.System.dto.admin.UpdateRoleRequest;
import com.example.Parcel.Management.System.dto.common.UserDetailResponseDto;
import com.example.Parcel.Management.System.dto.common.UsersListResponseDto;
import com.example.Parcel.Management.System.dto.receptionist.GenericAopDto;
import com.example.Parcel.Management.System.dto.receptionist.ParcelResponseDto;
import com.example.Parcel.Management.System.entity.Role;
import com.example.Parcel.Management.System.entity.Status;
import org.springframework.data.domain.Page;

import java.util.List;

public interface AdminService {
    public List<UserDetailResponseDto> getAllUsers();

    public List<ParcelResponseDto> getAllParcels();

    public List<UserDetailResponseDto> updateUserRole(List<UpdateRoleRequest> list);

    Page<UsersListResponseDto> getPaginatedUsers(int page, int size, String search);

    Page<ParcelResponseDto> getPaginatedParcels(int page, int size, Status filter);
}
