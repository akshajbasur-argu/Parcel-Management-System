package com.example.Parcel.Management.System.entity;


import jakarta.persistence.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
@Builder
public class Parcel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private String trackingId;
    private String description;
    private String shortcode;

    @Enumerated(EnumType.STRING)
    private Status status;

    @ManyToOne
    @JoinColumn(name = "recipient_id")
    @ToString.Exclude
    private User recipient;

    @ManyToOne
    @JoinColumn(name = "receptionist_id")
    @ToString.Exclude
    private User receptionist;

    @OneToOne
    private Otp otp;
}
