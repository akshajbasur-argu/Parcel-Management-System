package com.example.Parcel.Management.System.dto.receptionist;

import lombok.Data;

@Data
public class EmailDto {
    private String shortcode;
    private String recipientEmail;
    private int otp;
}
