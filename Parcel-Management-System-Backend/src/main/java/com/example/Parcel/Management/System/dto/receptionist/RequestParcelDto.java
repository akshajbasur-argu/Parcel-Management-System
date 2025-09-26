package com.example.Parcel.Management.System.dto.receptionist;

import lombok.AllArgsConstructor;
import lombok.Data;


@Data
@AllArgsConstructor

public class RequestParcelDto {

    private String description;
    private String shortcode;
    private long recipientId;
    private long receptionistId;

    public RequestParcelDto() {
        this.receptionistId = 1;
    }
}
