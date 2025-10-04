package com.example.Parcel.Management.System.controller;

import com.example.Parcel.Management.System.exceptions.InvalidRequestException;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class InvalidRequestHandlerController {

    @RequestMapping("/**")
    public void handleInvalidRequest() {
        throw new InvalidRequestException("The Request is not valid");
    }
}

