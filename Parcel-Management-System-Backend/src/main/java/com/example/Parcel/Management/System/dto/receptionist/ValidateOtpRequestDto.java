package com.example.Parcel.Management.System.dto.receptionist;

import lombok.Data;

@Data
public class ValidateOtpRequestDto {
    private long parcelId;
    private String otp;
}
