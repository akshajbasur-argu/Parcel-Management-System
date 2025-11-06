package com.example.Parcel.Management.System.service;

import com.example.Parcel.Management.System.dto.common.UserDetailResponseDto;
import com.example.Parcel.Management.System.entity.User;

import java.util.Optional;

public interface CustomOAuth2UserService {
    public User loadUser(String email, String name, String picture);

    public Optional<User> findByEmail(String email);

    public UserDetailResponseDto getUserDetails();
}
