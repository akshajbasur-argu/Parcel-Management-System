package com.example.Parcel.Management.System.repository;

import com.example.Parcel.Management.System.entity.Parcel;
import com.example.Parcel.Management.System.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ParcelRepo extends JpaRepository<Parcel, Long> {
    @Query(value = "select * from parcel where recipient_id=:id", nativeQuery = true)
    List<Parcel> findByRecipient(@Param("id") int id);
}
