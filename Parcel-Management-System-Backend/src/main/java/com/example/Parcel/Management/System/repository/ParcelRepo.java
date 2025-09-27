package com.example.Parcel.Management.System.repository;

import com.example.Parcel.Management.System.entity.Parcel;
import com.example.Parcel.Management.System.entity.Status;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ParcelRepo extends JpaRepository<Parcel, Long> {
    Page<Parcel> findByStatus(Pageable pageable, Status status);
}
