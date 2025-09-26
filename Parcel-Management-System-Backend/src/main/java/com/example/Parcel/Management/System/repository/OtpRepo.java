package com.example.Parcel.Management.System.repository;

import com.example.Parcel.Management.System.entity.Otp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OtpRepo extends JpaRepository<Otp, Long> {
}
