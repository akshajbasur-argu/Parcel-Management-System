package com.example.Parcel.Management.System.imageProcessing.service;

import com.example.Parcel.Management.System.imageProcessing.entity.UserInfo;
import lombok.RequiredArgsConstructor;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FetchNameFromDBService {
//    private final UserRepo userRepo;

    private final RestTemplate restTemplate;
    public List<UserInfo> dbNames() {
        String url = "https://apps.argusoft.com/ems-api/api/user/userInfo";

        HttpHeaders headers = new HttpHeaders();
        headers.add("Cookie",
                "JSESSIONID=080748A870D1935B11337676C0C26207; XSRF-TOKEN=7e17d4e1-1dcc-4d16-931d-94985923238e");

        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ResponseEntity<List<UserInfo>> response =
                restTemplate.exchange(
                        url,
                        HttpMethod.GET,
                        entity,
                        new ParameterizedTypeReference<List<UserInfo>>() {}
                );

        return response.getBody();

    }

}
