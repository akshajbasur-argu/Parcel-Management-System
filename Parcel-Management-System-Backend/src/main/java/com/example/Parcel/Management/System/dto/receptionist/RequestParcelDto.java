package com.example.Parcel.Management.System.dto.receptionist;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class RequestParcelDto {

    private String description;
    private String shortcode;
    private long recipientId;
    private long receptionistId;
}
