package com.example.Parcel.Management.System.controller;

import com.example.Parcel.Management.System.dto.ParcelResponseDto;
import com.example.Parcel.Management.System.dto.RequestParcelDto;
import com.example.Parcel.Management.System.entity.Parcel;
import com.example.Parcel.Management.System.service.ReceptionistService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;


@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/receptionist")
public class ReceptionistController {

    @Autowired
    private ReceptionistService receptionistService;
    @PostMapping("create/parcel")
    public ResponseEntity<ParcelResponseDto> createParcel(@RequestBody RequestParcelDto parcel)
    {
        return new ResponseEntity<>(receptionistService.createParcel(parcel), HttpStatus.OK);
    }




}
