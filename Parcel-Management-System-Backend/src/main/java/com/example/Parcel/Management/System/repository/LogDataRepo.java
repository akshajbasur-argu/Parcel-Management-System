package com.example.Parcel.Management.System.repository;

import com.example.Parcel.Management.System.entity.LogData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LogDataRepo extends JpaRepository<LogData,Long> {
}
