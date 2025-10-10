package com.example.Parcel.Management.System.dto.admin;

import com.example.Parcel.Management.System.entity.Status;
import lombok.Data;


@Data

public class UpdateStatusRequest {

    private long id;
    private Status status;
}
