package com.example.Parcel.Management.System.controller;

import com.example.Parcel.Management.System.dto.admin.UpdateRoleRequest;
import com.example.Parcel.Management.System.dto.common.UserDetailResponseDto;
import com.example.Parcel.Management.System.dto.receptionist.ParcelResponseDto;
import com.example.Parcel.Management.System.entity.Role;
import com.example.Parcel.Management.System.service.impl.AdminServiceImpl;
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
    private AdminServiceImpl adminService;

    @GetMapping("users")
    public ResponseEntity<List<UserDetailResponseDto>> getUsers(@CookieValue(name="accessToken") String token) {

        return new ResponseEntity<>(adminService.getAllUsers(token), HttpStatus.ACCEPTED);
    }

    @PostMapping("updateUser")
    public ResponseEntity<List<UserDetailResponseDto>> updateUserRole(
            @RequestBody List<UpdateRoleRequest> updates,
            @CookieValue(name = "accessToken") String token) {
        System.out.println("inside controller");
        adminService.updateUserRole(updates ,token);

        return new ResponseEntity<>(HttpStatus.OK);
    }


    @GetMapping("parcels")
    public ResponseEntity<List<ParcelResponseDto>> getAllParcels(){
        return new ResponseEntity<>(adminService.getAllParcels(),HttpStatus.OK);
    }

}

