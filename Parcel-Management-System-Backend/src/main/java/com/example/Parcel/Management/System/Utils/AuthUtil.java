package com.example.Parcel.Management.System.Utils;

import com.example.Parcel.Management.System.repository.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AuthUtil {
    private final UserRepo userRepo;

    public Long getAuthorityId(){
        return userRepo.findByEmail((String) SecurityContextHolder
                .getContext().getAuthentication().getPrincipal()).orElseThrow().getId();
    }
    public String getAuthorityName(){
        return SecurityContextHolder
                .getContext().getAuthentication().getPrincipal().toString();
    }
}
