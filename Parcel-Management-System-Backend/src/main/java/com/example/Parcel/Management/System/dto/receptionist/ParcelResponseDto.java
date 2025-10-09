package com.example.Parcel.Management.System.dto.receptionist;

import com.example.Parcel.Management.System.entity.Status;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ParcelResponseDto {
    private long id;
    private String trackingId;
    private String description;
    private String shortcode;
    private Status status;
    private String recipientName;
    private long employeeId;
    private Timestamp createdAt;
    private String parcelName;


}
