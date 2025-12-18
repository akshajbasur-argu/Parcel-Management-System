package com.example.Parcel.Management.System.repository;

import com.example.Parcel.Management.System.entity.Parcel;
import com.example.Parcel.Management.System.entity.Status;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ParcelRepo extends JpaRepository<Parcel, Long> {

    @Query(value = "select * from parcel where recipient_id=:id", nativeQuery = true)
    List<Parcel> findByRecipient(@Param("id") int id);

    Page<Parcel> findByStatus(Pageable pageable, Status status);

    Page<Parcel> findAll(Pageable pageable);

    Optional<Parcel> findFirstByRecipientEmailAndShortcodeAndStatus(
            String email,
            String shortcode,
            Status status
    );


    @Query("""
        SELECT p FROM Parcel p
        LEFT JOIN p.recipient r
        WHERE p.status = :status
        AND (
            LOWER(p.name) LIKE %:search%
            OR LOWER(p.trackingId) LIKE %:search%
            OR LOWER(p.shortcode) LIKE %:search%
            OR LOWER(p.description) LIKE %:search%
            OR LOWER(r.name) LIKE %:search
            OR LOWER(r.email) LIKE %:search%
        )
    """)
    Page<Parcel> searchParcels(
            Pageable pageable,
            @Param("status") Status status,
            @Param("search") String search

    );
}

