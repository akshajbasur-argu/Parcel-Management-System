package com.example.Parcel.Management.System.dto.receptionist;

import com.example.Parcel.Management.System.entity.Status;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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
    private long receptionistId;
    private long employeeId;


}
