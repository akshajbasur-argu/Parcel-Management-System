package com.example.Parcel.Management.System.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Notifications {
    private String sender;
    private String message;
    private Status status;
}
