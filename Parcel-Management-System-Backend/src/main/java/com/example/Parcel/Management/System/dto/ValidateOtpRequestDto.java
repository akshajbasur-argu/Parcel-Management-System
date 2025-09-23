package com.example.Parcel.Management.System.dto;

import lombok.Data;

@Data
public class ValidateOtpRequestDto {
    private long parcelId;
    private String otp;
}
