package com.example.Parcel.Management.System.controller;

import com.example.Parcel.Management.System.dto.common.UserDetailResponseDto;
import com.example.Parcel.Management.System.dto.receptionist.ParcelResponseDto;
import com.example.Parcel.Management.System.entity.Role;
import com.example.Parcel.Management.System.entity.User;
import com.example.Parcel.Management.System.service.impl.AdminService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@CrossOrigin(value="http://localhost:4200")
@RequestMapping("api/v1/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @GetMapping("users")
    public ResponseEntity<List<UserDetailResponseDto>> getUsers(@CookieValue(name="accessToken") String token) {

        return new ResponseEntity<>(adminService.getAllUsers(token), HttpStatus.ACCEPTED);
    }

    @PutMapping("updateUser/{id}")
    public ResponseEntity<?> updateUserRole(@PathVariable long id, @RequestBody String role,@CookieValue(name = "accessToken") String token) {
        System.out.println("inside controller");
        adminService.updateUserRole(id, Role.valueOf(role),token);

        return new ResponseEntity<>(HttpStatus.OK);
    }


    @GetMapping("parcels")
    public ResponseEntity<List<ParcelResponseDto>> getAllParcels(){
        return new ResponseEntity<>(adminService.getAllParcels(),HttpStatus.OK);
    }

}

