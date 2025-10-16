package com.example.Parcel.Management.System.entity;

import jakarta.persistence.*;
import lombok.*;

@Data
@NoArgsConstructor
@Getter
@Setter
@Entity
public class Notifications {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private String message;

    @Enumerated(EnumType.STRING)
    private Status status;
    public Notifications(User sender, String message, Status status, User receiver) {
        this.sender = sender;
        this.message = message;
        this.status = status;
        this.receiver = receiver;
    }
    @ManyToOne
    @JoinColumn(name = "sender_id")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private User sender;

    @ManyToOne
    @JoinColumn(name = "receiver_id")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private User receiver;

}
