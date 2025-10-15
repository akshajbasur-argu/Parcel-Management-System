package com.example.Parcel.Management.System.repository;

import com.example.Parcel.Management.System.entity.Notifications;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationsRepo extends JpaRepository<Notifications, Long> {
    @Query(value = "select * from notifications where receiver_id=:id and status!='COMPLETED'", nativeQuery = true)
    List<Notifications> findByReceiver(@Param("id") int id);
}
