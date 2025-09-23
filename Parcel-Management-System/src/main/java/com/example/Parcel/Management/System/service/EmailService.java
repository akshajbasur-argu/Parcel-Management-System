package com.example.Parcel.Management.System.service;

import com.example.Parcel.Management.System.dto.EmailDto;
import com.example.Parcel.Management.System.dto.ParcelResponseDto;
import com.example.Parcel.Management.System.entity.EmailDetails;
import lombok.RequiredArgsConstructor;
import lombok.Value;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;

@Service

public class EmailService {
    @Autowired
    private  JavaMailSender mailSender;


    private String sendMail(EmailDetails emailDetails){
        try{
            SimpleMailMessage mailMessage= new SimpleMailMessage();
            mailMessage.setFrom("akshaj.basur@argusoft.com");
            mailMessage.setTo(emailDetails.getReciepient());
            mailMessage.setText(emailDetails.getMessageBody());
            mailMessage.setSubject(emailDetails.getSubject());

            mailSender.send(mailMessage);
            return "Mail Sent Successfully";
        }
        catch (Exception ex)
        {
            return "Error While Sending Mail";
        }
    }
    public String getEmailDetails(EmailDto responseDto)
    {
        EmailDetails details= new EmailDetails();
        details.setSubject("Parcel confirmed");
        details.setReciepient(responseDto.getRecipientEmail());
        details.setMessageBody("Short Code:  " +responseDto.getShortcode()+"\n"
        +"Otp:  "+ responseDto.getOtp());

        return sendMail(details);
    }
    public String getNotificationDetails(String mail){
        EmailDetails details= new EmailDetails();
        details.setSubject("Parcel Received at Reception");
        details.setReciepient(mail);
        details.setMessageBody("We have received a parcel for you at the reception,\n" +
                " If you would like to receive the parcel, please reply yes to this mail \n" +
                "\n Team\nParcel Management");

        return sendMail(details);
    }
}
