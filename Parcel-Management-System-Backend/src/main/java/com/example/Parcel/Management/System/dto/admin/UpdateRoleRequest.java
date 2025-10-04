package com.example.Parcel.Management.System.dto.admin;

import com.example.Parcel.Management.System.entity.Role;
import lombok.Data;

@Data
public class UpdateRoleRequest {
    private long id;
    private Role role;
}
