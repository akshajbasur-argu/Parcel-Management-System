package com.example.Parcel.Management.System.controller;

import com.example.Parcel.Management.System.dto.UserDetailResponseDto;
import com.example.Parcel.Management.System.entity.Role;
import com.example.Parcel.Management.System.entity.User;
import com.example.Parcel.Management.System.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/v1/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @GetMapping("users")
    public ResponseEntity<List<UserDetailResponseDto>> getUsers(){
        return new ResponseEntity<>(adminService.getAllUsers(), HttpStatus.ACCEPTED);
    }

    @PutMapping("/updateUser/{id}")
    public ResponseEntity<User> updateUserRole(@PathVariable long id, @RequestBody Role role){
        return new ResponseEntity<User>(adminService.updateUserRole(id, role), HttpStatus.OK);
    }

}

