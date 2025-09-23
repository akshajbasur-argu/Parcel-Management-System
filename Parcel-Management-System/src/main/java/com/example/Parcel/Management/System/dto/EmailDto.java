package com.example.Parcel.Management.System.dto;

import lombok.Data;

@Data
public class EmailDto {
    private String shortcode;
    private String recipientEmail;
    private String otp;
}
