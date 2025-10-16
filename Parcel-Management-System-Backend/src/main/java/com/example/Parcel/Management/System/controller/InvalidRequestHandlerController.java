package com.example.Parcel.Management.System.controller;

import com.example.Parcel.Management.System.exceptions.InvalidRequestException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

//@RestController
//public class InvalidRequestHandlerController {
//
//    @RequestMapping(value = "/**")
//    public void handleInvalidRequest(HttpServletRequest request) {
//        String path = request.getRequestURI();
//        if (path.startsWith("/ws")) {
//            return;
//        }
//        throw new InvalidRequestException("Invalid request received for path: " + path);
//    }
//}
//
