package com.example.Parcel.Management.System;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.EnableAspectJAutoProxy;

@SpringBootApplication
@EnableAspectJAutoProxy
public class ParcelManagementSystemApplication {

    public static void main(String[] args) {
        SpringApplication.run(ParcelManagementSystemApplication.class, args);
    }

}
