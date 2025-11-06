package com.example.Parcel.Management.System.entity;


import jakarta.persistence.*;
import lombok.*;

import java.sql.Timestamp;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Builder
public class Parcel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private String name;
    private String trackingId;
    private String description;
    private String shortcode;

    @Enumerated(EnumType.STRING)
    private Status status;

    @ManyToOne
    @JoinColumn(name = "recipient_id")
    @ToString.Exclude

    @EqualsAndHashCode.Exclude

    private User recipient;

    @ManyToOne
    @JoinColumn(name = "receptionist_id")
    @ToString.Exclude

    @EqualsAndHashCode.Exclude

    private User receptionist;

    @OneToOne
    private Otp otp;

    private Timestamp createdAt;
}