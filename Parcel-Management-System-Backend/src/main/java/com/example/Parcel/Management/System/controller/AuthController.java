package com.example.Parcel.Management.System.controller;

import com.example.Parcel.Management.System.Utils.JwtUtil;
import com.example.Parcel.Management.System.dto.common.UserDetailResponseDto;
import com.example.Parcel.Management.System.entity.User;
import com.example.Parcel.Management.System.repository.UserRepo;
import com.example.Parcel.Management.System.service.impl.CustomOAuth2UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private CustomOAuth2UserService customOAuth2UserService;

    @Autowired
    private JwtUtil jwtUtil;

    @Value("${app.jwt.access-token-ttl-seconds}")
    private long accessTokenTtlSeconds;

    @Value("${app.jwt.refresh-token-ttl-seconds}")
    private long refreshTokenTtlSeconds;

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
    @GetMapping("refresh")
    public ResponseEntity<?> refreshToken(@CookieValue(name="refreshToken", required = false) String refreshToken,
                                                            HttpServletResponse response) throws Exception{
        if(refreshToken == null || !jwtUtil.validateToken(refreshToken)){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error","Invalid Refresh Token"));
        }
        try {
            String email = jwtUtil.getEmailFromToken(refreshToken);
            User user = customOAuth2UserService.findByEmail(email).orElseThrow(() ->
            new RuntimeException("User not found"));

            String accessToken = jwtUtil.generateAccessToken(user);
            refreshToken = jwtUtil.generateRefreshToken(user);

            ResponseCookie accessCookie = ResponseCookie.from("accessToken", accessToken)
                    .httpOnly(false)
                    .path("/")
                    .maxAge(Duration.ofSeconds(accessTokenTtlSeconds))
                    .build();
            ResponseCookie refreshCookie = ResponseCookie.from("refreshToken", refreshToken)
                    .httpOnly(false)
                    .path("/")
                    .maxAge(Duration.ofSeconds(refreshTokenTtlSeconds))
                    .build();

            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, accessCookie.toString())
                    .header(HttpHeaders.SET_COOKIE, refreshToken.toString())
                    .body(Map.of("message","Tokens refreshed successfully"));

        }catch (Exception e){
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error","Failed to refresh token"));
        }
    }
}
