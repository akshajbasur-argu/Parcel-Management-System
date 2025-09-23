package com.example.Parcel.Management.System.security;

import com.example.Parcel.Management.System.service.CustomOAuth2UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@Slf4j
public class WebSecurityConfig {

    @Autowired
    private CustomOAuth2UserService customOAuth2UserService;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/me").authenticated()
                        .anyRequest().permitAll())

                .oauth2Login(oauth -> oauth.userInfoEndpoint(
                        userInfo -> userInfo
                        .userService(customOAuth2UserService)));
        return http.build();

    }
}
