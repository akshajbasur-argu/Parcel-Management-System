package com.example.Parcel.Management.System.dto.common;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class NotificationResponseDto {
    private long id;
    private long senderId;
    private long receiverId;
    private String status;
    private String receiverName;
    private String senderName;
    private String message;
}
