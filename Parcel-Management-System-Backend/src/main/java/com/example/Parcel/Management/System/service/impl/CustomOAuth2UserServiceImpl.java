package com.example.Parcel.Management.System.service.impl;

import com.example.Parcel.Management.System.Utils.AuthUtil;
import com.example.Parcel.Management.System.dto.common.UserDetailResponseDto;
import com.example.Parcel.Management.System.entity.Role;
import com.example.Parcel.Management.System.entity.User;
import com.example.Parcel.Management.System.repository.UserRepo;
import com.example.Parcel.Management.System.service.CustomOAuth2UserService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserServiceImpl implements CustomOAuth2UserService {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private AuthUtil authUtil;

    @Autowired
    private ModelMapper modelMapper;

    @Transactional
    public User loadUser(String email, String name, String picture) {

        System.out.println("inside****************************************************");

        return userRepo.findByEmail(email).orElseGet(() -> {
            User newUser = new User();
            newUser.setPicture(picture);
            newUser.setEmail(email);
            newUser.setName(name);
            newUser.setRole(Role.EMPLOYEE);
            return userRepo.save(newUser);

//            UserDetailResponseDto dto = new UserDetailResponseDto();
//            dto.setId(dto.getId());
//            dto.setEmail(dto.getEmail());
//            dto.setName(dto.getName());
//            dto.setRole(dto.getRole().name());
//            return dto;
        });
    }

    public Optional<User> findByEmail(String email) {
        return userRepo.findByEmail(email);
    }
    public UserDetailResponseDto getUserDetails(){
        return modelMapper.map(userRepo.findById(authUtil.getAuthorityId()), UserDetailResponseDto.class);
    }
}

//()->{
//User u = new User();
//                    u.setGoogleId(googleId);
//                    u.setEmail(email);
//                    u.setName(name);
//                    u.setRole(Role.EMPLOYEE);
//                    return u;
//                }