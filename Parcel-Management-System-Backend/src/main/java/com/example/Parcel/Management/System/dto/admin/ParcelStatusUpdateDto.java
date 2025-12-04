package com.example.Parcel.Management.System.dto.admin;

import com.example.Parcel.Management.System.entity.Status;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;

import java.sql.Timestamp;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ParcelStatusUpdateDto {

    private long id;
    private String name;
    private String description;
    private String shortcode;

    private Status status;
    private Status oldStatus;
    private Timestamp createdAt;

    private long adminId;


}
