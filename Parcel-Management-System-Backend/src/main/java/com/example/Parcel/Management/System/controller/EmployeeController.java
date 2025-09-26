package com.example.Parcel.Management.System.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(value="http://localhost:4200")
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/employee")
public class EmployeeController {
}
