package com.example.Parcel.Management.System.service;

import com.example.Parcel.Management.System.dto.receptionist.EmailDto;
import com.example.Parcel.Management.System.entity.EmailDetails;

public interface EmailService {
    public String sendMail(EmailDetails emailDetails);

    public String getEmailDetails(EmailDto responseDto);

    public String getNotificationDetails(String mail);

}
