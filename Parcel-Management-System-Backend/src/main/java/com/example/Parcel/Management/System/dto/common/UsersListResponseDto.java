package com.example.Parcel.Management.System.dto.common;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UsersListResponseDto {
    private long id;
    private String email;
    private String name;
}
