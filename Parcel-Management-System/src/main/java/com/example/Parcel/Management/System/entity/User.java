package com.example.Parcel.Management.System.entity;


import jakarta.persistence.*;
import lombok.*;
import org.hibernate.engine.internal.Cascade;

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
    @GeneratedValue(strategy =GenerationType.IDENTITY )
    private long id;

    private String email;
    private String name;

    @Enumerated(EnumType.STRING)
    private Role role;

    @OneToMany(mappedBy = "recipient", cascade = CascadeType.ALL)
    private List<Parcel> parcelListForRecipient;

    @OneToMany(mappedBy = "receptionist", cascade = CascadeType.ALL)
    private List<Parcel> parcelListForReceptionist;

}
