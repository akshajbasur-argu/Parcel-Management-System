package com.example.Parcel.Management.System.service;

import com.example.Parcel.Management.System.entity.Role;
import com.example.Parcel.Management.System.entity.User;
import com.example.Parcel.Management.System.repository.UserRepo;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepo userRepo;

    @Override
    @Transactional
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {

        System.out.println("inside****************************************************");
        OAuth2User oAuth2User = super.loadUser(userRequest);
        System.out.println(oAuth2User);
        String googleId = oAuth2User.getAttribute("sub");
        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");

        User user = userRepo.findByGoogleId(googleId)
                .orElseGet(()->{
                    User u = new User();
                    u.setGoogleId(googleId);
                    u.setEmail(email);
                    u.setName(name);
                    u.setRole(Role.EMPLOYEE);
                    return u;
                });
        user.setEmail(email);
        user.setName(name);
        user = userRepo.save(user);

        List<GrantedAuthority> authorities = List.of(new SimpleGrantedAuthority("ROLE_"+ user.getRole().name()));

        return new DefaultOAuth2User(
                authorities,
                oAuth2User.getAttributes(),"sub"
        );
    }
}
