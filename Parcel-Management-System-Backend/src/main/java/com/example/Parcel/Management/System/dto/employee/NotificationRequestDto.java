package com.example.Parcel.Management.System.dto.employee;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class NotificationRequestDto {
    private long id;
    private String status;
    private long sender;
}
