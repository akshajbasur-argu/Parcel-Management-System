package com.example.Parcel.Management.System.dto;

import com.example.Parcel.Management.System.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDetailResponseDto {

    private long id;
    private String email;
    private String name;
    private Role role;
}
