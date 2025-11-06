package com.example.Parcel.Management.System.dto.admin;

import com.example.Parcel.Management.System.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserRoleUpdateDto {

    private long id;
    private String email;
    private String name;
    private Role role;
    private Role oldRole;
    private long adminId;
}
