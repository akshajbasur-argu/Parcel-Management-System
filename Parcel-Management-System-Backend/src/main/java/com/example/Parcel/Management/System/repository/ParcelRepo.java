package com.example.Parcel.Management.System.repository;

import com.example.Parcel.Management.System.entity.Parcel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ParcelRepo extends JpaRepository<Parcel,Long> {
}
