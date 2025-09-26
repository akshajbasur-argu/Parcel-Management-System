package com.example.Parcel.Management.System.controller;

import com.example.Parcel.Management.System.dto.common.UsersListResponseDto;
import com.example.Parcel.Management.System.dto.receptionist.ParcelResponseDto;
import com.example.Parcel.Management.System.dto.receptionist.RequestParcelDto;
import com.example.Parcel.Management.System.dto.receptionist.ValidateOtpRequestDto;
import com.example.Parcel.Management.System.service.ReceptionistService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(value="http://localhost:4200")
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

    @PostMapping("validate")
    public ResponseEntity<String> validateOtp(@RequestBody ValidateOtpRequestDto otp){
        return new ResponseEntity<>(receptionistService.validateOtp(otp),HttpStatus.OK);
    }

    @GetMapping("resend/{parcelId}")
    public ResponseEntity<String> resendOtp(@PathVariable long parcelId){
        receptionistService.resendOtp(parcelId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("parcels")
    public ResponseEntity<List<ParcelResponseDto>> getAllParcels(){
        return new ResponseEntity<>(receptionistService.getAllParcels(),HttpStatus.OK);
    }

    @GetMapping("notify/{id}")
    public ResponseEntity notifyAboutParcel(@PathVariable long id){
        receptionistService.sendNotification(id);
        return ResponseEntity.status(HttpStatus.OK).build();
    }
    @GetMapping("users")
    public ResponseEntity<List<UsersListResponseDto>> getAllUsers()
    {
        return new ResponseEntity<>(receptionistService.getAllUsers(),HttpStatus.OK);
    }
}
