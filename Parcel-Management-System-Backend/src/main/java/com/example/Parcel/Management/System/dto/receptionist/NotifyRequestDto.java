package com.example.Parcel.Management.System.dto.receptionist;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class NotifyRequestDto {
    private long userId;
    private String description;
}
