package com.example.Parcel.Management.System.service;

import com.example.Parcel.Management.System.entity.User;

import java.util.Optional;

public interface CustomOAuth2UserService {
    public User loadUser(String email, String name) ;
    public Optional<User> findByEmail(String email) ;
}
