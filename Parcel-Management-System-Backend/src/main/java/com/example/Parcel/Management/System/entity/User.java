package com.example.Parcel.Management.System.entity;


import jakarta.persistence.*;
import lombok.*;
import org.springframework.context.annotation.Lazy;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private String googleId;
    private String email;
    private String name;

    @Enumerated(EnumType.STRING)
    private Role role;

    @OneToMany(mappedBy = "recipient", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<Parcel> parcelListForRecipient;

    @OneToMany(mappedBy = "receptionist", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<Parcel> parcelListForReceptionist;

}
