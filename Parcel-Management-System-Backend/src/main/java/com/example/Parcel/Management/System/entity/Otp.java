package com.example.Parcel.Management.System.entity;


import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
public class Otp {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String hashedOtp;
    private LocalDateTime timestamp;

    @OneToOne
    @JoinColumn(name = "parcel_id")
    private Parcel parcel;
}
