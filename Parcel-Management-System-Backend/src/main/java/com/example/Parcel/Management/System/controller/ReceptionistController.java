package com.example.Parcel.Management.System.controller;

import com.example.Parcel.Management.System.dto.common.UsersListResponseDto;
import com.example.Parcel.Management.System.dto.receptionist.ParcelResponseDto;
import com.example.Parcel.Management.System.dto.receptionist.RequestParcelDto;
import com.example.Parcel.Management.System.dto.receptionist.ValidateOtpRequestDto;
import com.example.Parcel.Management.System.service.ReceptionistService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
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
    public ResponseEntity<Void> validateOtp(@RequestBody ValidateOtpRequestDto otp){
        receptionistService.validateOtp(otp);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("resend/{parcelId}")
    public ResponseEntity<String> resendOtp(@PathVariable long parcelId){
        receptionistService.resendOtp(parcelId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("parcels/{num}")
    public ResponseEntity<Page<ParcelResponseDto>> getActiveParcels(@PathVariable int num){
        return new ResponseEntity<>(receptionistService.getActiveParcels(num),HttpStatus.OK);
    }

    @GetMapping("parcels/history/{num}")
    public ResponseEntity<Page<ParcelResponseDto>> getParcelHistory(@PathVariable int num){
        return new ResponseEntity<>(receptionistService.getParcelHistory(num),HttpStatus.OK);
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
