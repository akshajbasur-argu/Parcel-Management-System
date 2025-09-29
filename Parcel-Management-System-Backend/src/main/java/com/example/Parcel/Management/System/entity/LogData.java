package com.example.Parcel.Management.System.entity;


import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
@Builder
public class LogData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private Role role;
    private long authorityId;
    private long employeeId;
    private String action;
    private LocalDateTime dateStamp;
}
