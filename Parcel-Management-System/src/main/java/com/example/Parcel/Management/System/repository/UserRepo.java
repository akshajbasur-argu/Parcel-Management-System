package com.example.Parcel.Management.System.repository;

import com.example.Parcel.Management.System.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepo extends JpaRepository<User,Long> {
}
