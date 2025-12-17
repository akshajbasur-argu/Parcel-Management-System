package com.example.Parcel.Management.System.security;

import com.example.Parcel.Management.System.Utils.JwtUtil;
import com.example.Parcel.Management.System.entity.User;
import com.example.Parcel.Management.System.service.impl.CustomOAuth2UserServiceImpl;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.Duration;

@RequiredArgsConstructor
@Component
public class CustomAuthenticationSuccessHandler implements AuthenticationSuccessHandler {

    private final CustomOAuth2UserServiceImpl customOAuth2UserService;

    private final JwtUtil jwtUtil;
    @Value("${app.jwt.access-token-ttl-seconds}")
    private long accessTokenTtlSeconds;

    @Value("${app.jwt.refresh-token-ttl-seconds}")
    private long refreshTokenTtlSeconds;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        System.out.println(oAuth2User);
        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");
        String photo =(String) oAuth2User.getAttribute("picture");
        System.out.println("Picture "+photo);

        User user = customOAuth2UserService.loadUser(email, name,photo);
        System.out.println("in side success handler after user" + user);

        try {
            String accessToken = jwtUtil.generateAccessToken(user);
            String refreshToken = jwtUtil.generateRefreshToken(user);

            ResponseCookie accessCookie = ResponseCookie.from("accessToken", accessToken)
                    .httpOnly(false)
                    .path("/")
                    .maxAge(Duration.ofSeconds(300))
                    .build();
            ResponseCookie refreshCookie = ResponseCookie.from("refreshToken", refreshToken)
                    .httpOnly(false)
                    .path("/")
                    .maxAge(Duration.ofSeconds(1200))
                    .build();

            response.addHeader(HttpHeaders.SET_COOKIE, accessCookie.toString());
            response.addHeader(HttpHeaders.SET_COOKIE, refreshCookie.toString());

            response.sendRedirect("https://sjkqbbn5-4200.inc1.devtunnels.ms/oauth2/callback");
        } catch (Exception e) {
            e.printStackTrace();
            response.sendRedirect("http://localhost:4200/login-error");
        }

    }
}
