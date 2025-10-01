package com.example.Parcel.Management.System.controller;

import com.example.Parcel.Management.System.dto.receptionist.ParcelResponseDto;
import com.example.Parcel.Management.System.service.impl.EmployeeServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(value="http://localhost:4200")
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/employee")
public class EmployeeController {



    private final EmployeeServiceImpl employeeService;

    @GetMapping("parcels")
    public ResponseEntity<List<ParcelResponseDto>> getAllParcels(@CookieValue(name="accessToken") String token){
        System.out.println(token);
        return new ResponseEntity<>(employeeService.getAllParcels(token), HttpStatus.OK);
    }
}
