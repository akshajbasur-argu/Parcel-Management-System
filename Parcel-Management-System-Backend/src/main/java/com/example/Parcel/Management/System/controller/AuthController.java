package com.example.Parcel.Management.System.controller;

import com.example.Parcel.Management.System.dto.common.UserDetailResponseDto;
import com.example.Parcel.Management.System.entity.User;
import com.example.Parcel.Management.System.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepo userRepo;

    @GetMapping("/me")
    public ResponseEntity<UserDetailResponseDto> getCurrentUser(
            @AuthenticationPrincipal String email){
        if (email == null){
            return ResponseEntity.status((HttpStatus.UNAUTHORIZED)).build();
        }

//        String email = principal.getAttribute("email");
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User Not Found"));

        UserDetailResponseDto dto = new UserDetailResponseDto(user.getId(), user.getName(), user.getEmail(), user.getRole());
        return ResponseEntity.ok(dto);
    }
}
