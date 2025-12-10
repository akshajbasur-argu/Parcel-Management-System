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
                "JSESSIONID=4ACB892BC994906042E1ED73E6BE70F6; XSRF-TOKEN=8cc7c1fa-e5ec-446d-8d81-51a7e2ade713");

        HttpEntity<Void> entity = new HttpEntity<>(headers);
        ResponseEntity<List<UserInfo>> response;
        try {
            response=
                    restTemplate.exchange(
                            url,
                            HttpMethod.GET,
                            entity,
                            new ParameterizedTypeReference<List<UserInfo>>() {
                            }
                    );
        }
        catch (Exception e){
            throw  new RuntimeException("Token Expired");
        }
        return response.getBody();


    }

}
