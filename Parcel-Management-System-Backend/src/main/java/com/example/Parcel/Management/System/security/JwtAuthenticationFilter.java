package com.example.Parcel.Management.System.security;

import com.example.Parcel.Management.System.Utils.JwtUtil;
import com.nimbusds.jwt.SignedJWT;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.text.ParseException;
import java.util.Collections;
import java.util.Date;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        // Skip JWT validation for WebSocket connections
        String requestURI = request.getRequestURI();
        if (requestURI.startsWith("/ws")) {
            log.debug("Skipping JWT filter for WebSocket endpoint: {}", requestURI);
            filterChain.doFilter(request, response);
            return;
        }



        String token = extractTokenFromCookie(request);

        if (token != null && jwtUtil.validateToken(token)) {
            try {
                SignedJWT signedJWT = SignedJWT.parse(token);

                Date expiration = signedJWT.getJWTClaimsSet().getExpirationTime();
                if (expiration != null && expiration.after(new Date())) {
                    String email = signedJWT.getJWTClaimsSet().getSubject();
                    String role = (String) signedJWT.getJWTClaimsSet().getClaim("role");

                    if (email != null && role != null) {
                        SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + role);

                        UsernamePasswordAuthenticationToken authentication =
                                new UsernamePasswordAuthenticationToken(
                                        email,
                                        null,
                                        Collections.singletonList(authority)
                                );

                        SecurityContextHolder.getContext().setAuthentication(authentication);
                        log.debug("User authenticated: {} with role: {}", email, role);
                    }
                }
            } catch (ParseException e) {
                log.error("Error parsing JWT token", e);
            }
        }

        filterChain.doFilter(request, response);
    }

    private String extractTokenFromCookie(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("accessToken".equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }
}