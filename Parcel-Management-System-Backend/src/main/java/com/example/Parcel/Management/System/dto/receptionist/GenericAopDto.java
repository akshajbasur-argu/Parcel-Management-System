package com.example.Parcel.Management.System.dto.receptionist;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class GenericAopDto {
    private long employeeId;
    private String status;
    private String recipientName;
}
