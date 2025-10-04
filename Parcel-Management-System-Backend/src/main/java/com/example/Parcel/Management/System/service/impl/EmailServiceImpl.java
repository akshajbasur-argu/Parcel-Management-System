package com.example.Parcel.Management.System.service.impl;

import com.example.Parcel.Management.System.dto.receptionist.EmailDto;
import com.example.Parcel.Management.System.entity.EmailDetails;
import com.example.Parcel.Management.System.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service

public class EmailServiceImpl implements EmailService {
    @Autowired
    private JavaMailSender mailSender;


    public String sendMail(EmailDetails emailDetails) {

        SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setFrom("akshaj.basur@argusoft.com");
        mailMessage.setTo(emailDetails.getReciepient());
        mailMessage.setText(emailDetails.getMessageBody());
        mailMessage.setSubject(emailDetails.getSubject());

        try {
            mailSender.send(mailMessage);
            return "Mail Sent Successfully";
        } catch (MailException ex) {
            return "Error While Sending Mail    ";
        }
    }

    public String getEmailDetails(EmailDto responseDto) {
        EmailDetails details = new EmailDetails();
        details.setSubject("Parcel confirmed");
        details.setReciepient(responseDto.getRecipientEmail());
        details.setMessageBody("Short Code:  " + responseDto.getShortcode() + "\n"
                + "Otp:  " + responseDto.getOtp());

        return sendMail(details);
    }

    public String getNotificationDetails(String mail) {
        EmailDetails details = new EmailDetails();
        details.setSubject("Parcel Received at Reception");
        details.setReciepient(mail);
        details.setMessageBody("We have received a parcel for you at the reception,\n" +
                " If you would like to receive the parcel, please reply yes to this mail \n" +
                "\n Team\nParcel Management");

        return sendMail(details);
    }
}
