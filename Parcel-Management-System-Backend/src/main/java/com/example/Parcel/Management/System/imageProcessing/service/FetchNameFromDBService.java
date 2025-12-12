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
                "JSESSIONID=F797ECE6150361D254285AA87EE23547; XSRF-TOKEN=a9095edd-daa0-4d10-991f-f96618ea614e");

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
