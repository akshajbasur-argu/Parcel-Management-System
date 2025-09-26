package com.example.Parcel.Management.System.controller;

import com.example.Parcel.Management.System.dto.receptionist.ParcelResponseDto;
import com.example.Parcel.Management.System.dto.receptionist.RequestParcelDto;
import com.example.Parcel.Management.System.dto.receptionist.ValidateOtpRequestDto;
import com.example.Parcel.Management.System.service.impl.ReceptionistService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/receptionist")
public class ReceptionistController {

    @Autowired
    private ReceptionistService receptionistService;

    @PostMapping("create/parcel")
    public ResponseEntity<ParcelResponseDto> createParcel(@RequestBody RequestParcelDto parcel) {
        return new ResponseEntity<>(receptionistService.createParcel(parcel), HttpStatus.OK);
    }

    @PostMapping("validate")
    public ResponseEntity<String> validateOtp(@RequestBody ValidateOtpRequestDto otp) {
        return new ResponseEntity(receptionistService.validateOtp(otp), HttpStatus.FOUND);
    }

    @GetMapping("resend/{parcelId}")
    public ResponseEntity<String> resendOtp(@PathVariable long parcelId) {
        return new ResponseEntity(receptionistService.resendOtp(parcelId), HttpStatus.FOUND);
    }

    @GetMapping("parcels")
    public ResponseEntity<List<ParcelResponseDto>> getAllParcels() {
        return new ResponseEntity(receptionistService.getAllParcels(), HttpStatus.OK);
    }

    @GetMapping("notify/{id}")
    public ResponseEntity notifyAboutParcel(@PathVariable long id) {
        receptionistService.sendNotification(id);
        return ResponseEntity.status(HttpStatus.OK).build();
    }
}
