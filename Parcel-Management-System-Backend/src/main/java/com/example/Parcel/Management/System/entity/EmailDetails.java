package com.example.Parcel.Management.System.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EmailDetails {
    private String reciepient;
    private String messageBody;
    private String subject;
}
