package com.example.Parcel.Management.System.dto;

import com.example.Parcel.Management.System.entity.Status;
import com.example.Parcel.Management.System.entity.User;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Data;

@Data
public class ParcelResponseDto {
    private long id;
    private String trackingId;
    private String description;
    private String shortcode;
    private Status status;
    private String recipientName;
    private String recipientEmail;
    private String receptionistName;

}
