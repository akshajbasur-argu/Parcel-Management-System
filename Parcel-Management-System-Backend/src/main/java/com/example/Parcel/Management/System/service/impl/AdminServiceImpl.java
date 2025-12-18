package com.example.Parcel.Management.System.service.impl;

import com.example.Parcel.Management.System.Utils.AuthUtil;
import com.example.Parcel.Management.System.Utils.JwtUtil;
import com.example.Parcel.Management.System.dto.admin.ParcelStatusUpdateDto;
import com.example.Parcel.Management.System.dto.admin.UpdateRoleRequest;
import com.example.Parcel.Management.System.dto.admin.UpdateStatusRequest;
import com.example.Parcel.Management.System.dto.admin.UserRoleUpdateDto;
import com.example.Parcel.Management.System.dto.common.UserDetailResponseDto;
import com.example.Parcel.Management.System.dto.common.UsersListResponseDto;
import com.example.Parcel.Management.System.dto.receptionist.ParcelResponseDto;
import com.example.Parcel.Management.System.entity.Parcel;
import com.example.Parcel.Management.System.entity.Role;
import com.example.Parcel.Management.System.entity.Status;
import com.example.Parcel.Management.System.entity.User;
import com.example.Parcel.Management.System.repository.OtpRepo;
import com.example.Parcel.Management.System.repository.ParcelRepo;
import com.example.Parcel.Management.System.repository.UserRepo;
import com.example.Parcel.Management.System.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {
    private final Updates updateRole;
    private final Updates updateStatus;
    private final ModelMapper modelMapper;
    private final JwtUtil jwtUtil;
    private final AuthUtil authUtil;
    private final UserRepo userRepo;

    private final ParcelRepo parcelRepo;

    public List<UserDetailResponseDto> getAllUsers() {

        UserDetailResponseDto admin = modelMapper.map(userRepo.findById(authUtil.getAuthorityId())
                .orElseThrow(() -> new UsernameNotFoundException("No User found")), UserDetailResponseDto.class);

        List<UserDetailResponseDto> list = new java.util.ArrayList<>(userRepo.findAll(Sort.by(Sort.Direction.DESC, "id")).stream()
                .map(user -> modelMapper.map(user, UserDetailResponseDto.class))
                .toList());
        list.remove(admin);
        return list;

    }

    public List<ParcelResponseDto> getAllParcels() {
        return parcelRepo.findAll().stream().map(parcel ->
                modelMapper.map(parcel, ParcelResponseDto.class)).toList();
    }

    public List<UserDetailResponseDto> updateUserRole(List<UpdateRoleRequest> list) {
        list.forEach(updateRole::changeRole);

        return getAllUsers();
    }

    @Override
    public Page<UsersListResponseDto> getPaginatedUsers(int page, int size, String search) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());

        Page<User> usersPage =
                (search == null || search.trim().isEmpty())
                        ? userRepo.findAll(pageable)
                        : userRepo.findByNameContainingIgnoreCase(search.trim(), pageable);

        // MODEL MAPPER MAPPING TO PAGE DTO
        return usersPage.map(user -> modelMapper.map(user, UsersListResponseDto.class));
    }

    public List<ParcelResponseDto> updateParcelStatus(List<UpdateStatusRequest> list) {
        list.forEach(updateStatus::changeStatus);

        return getAllParcels();
    }

    @Override
    public Page<ParcelResponseDto> getPaginatedParcels(int page, int size, Status filter){
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());

        Page<Parcel> parcelsPage=
                (filter == null)
                        ?parcelRepo.findAll(pageable)
                        :parcelRepo.findByStatus(pageable, filter);

        return parcelsPage.map(parcel -> modelMapper.map(parcel, ParcelResponseDto.class));

    }

}

@Service
@RequiredArgsConstructor
class Updates {
    private final UserRepo userRepo;
    private final AuthUtil authUtil;
    private final ParcelRepo parcelRepo;
    private final OtpRepo otpRepo;

    public UserRoleUpdateDto changeRole(UpdateRoleRequest update) {
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
                authUtil.getAuthorityId()
        );
    }

    public ParcelStatusUpdateDto changeStatus(UpdateStatusRequest update) {
        Parcel parcel = parcelRepo.findById(update.getId())
                .orElseThrow(() -> new RuntimeException("Parcel Not Found with id: " + update.getId()));
        if (parcel.getStatus().name().equals(Status.RECEIVED.name())) {
            Status oldStatus = parcel.getStatus();
            parcel.setStatus(update.getStatus());
            long otpId = parcel.getOtp().getId();
            parcel.setOtp(null);
            otpRepo.deleteById(otpId);
            System.out.println(parcelRepo.save(parcel));

            return new ParcelStatusUpdateDto(
                    parcel.getId(),
                    parcel.getName(),
                    parcel.getShortcode(),
                    parcel.getDescription(),
                    parcel.getStatus(),
                    oldStatus,
                    parcel.getCreatedAt(),
                    authUtil.getAuthorityId()
            );
        }
        return null;
    }


}
