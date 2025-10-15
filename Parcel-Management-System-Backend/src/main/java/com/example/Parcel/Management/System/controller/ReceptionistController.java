package com.example.Parcel.Management.System.controller;

import com.example.Parcel.Management.System.dto.common.NotificationResponseDto;
import com.example.Parcel.Management.System.dto.common.UsersListResponseDto;
import com.example.Parcel.Management.System.dto.receptionist.NotifyRequestDto;
import com.example.Parcel.Management.System.dto.receptionist.ParcelResponseDto;
import com.example.Parcel.Management.System.dto.receptionist.RequestParcelDto;
import com.example.Parcel.Management.System.dto.receptionist.ValidateOtpRequestDto;
import com.example.Parcel.Management.System.entity.Notifications;
import com.example.Parcel.Management.System.service.ReceptionistService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(value = "http://localhost:4200")
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/receptionist")
@PreAuthorize("hasRole('RECEPTIONIST')")
public class ReceptionistController {

    @Autowired
    private ReceptionistService receptionistService;

    @PostMapping("create/parcel")
    public ResponseEntity<ParcelResponseDto> createParcel(@RequestBody RequestParcelDto parcel) {
        return new ResponseEntity<>(receptionistService.createParcel(parcel), HttpStatus.OK);
    }

    @PostMapping("validate")
    public ResponseEntity<Void> validateOtp(@RequestBody ValidateOtpRequestDto otp) {
        if (receptionistService.validateOtp(otp).getStatus().equals("Successfull")) {
            return new ResponseEntity<>(HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.CONFLICT);
    }

    @GetMapping("resend/{parcelId}")
    public ResponseEntity<String> resendOtp(@PathVariable long parcelId) {
        receptionistService.resendOtp(parcelId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("parcels/{num}")
    public ResponseEntity<Page<ParcelResponseDto>> getActiveParcels(@PathVariable int num) {
        return new ResponseEntity<>(receptionistService.getActiveParcels(num), HttpStatus.OK);
    }

    @GetMapping("parcels/history/{num}")
    public ResponseEntity<Page<ParcelResponseDto>> getParcelHistory(@PathVariable int num) {
        return new ResponseEntity<>(receptionistService.getParcelHistory(num), HttpStatus.OK);
    }

    @PostMapping("notify")
    public ResponseEntity<Void> notifyAboutParcel(@RequestBody NotifyRequestDto notifyRequestDto) {
        receptionistService.sendNotification(notifyRequestDto.getId(),notifyRequestDto.getMessage());

        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @GetMapping("users")
    public ResponseEntity<List<UsersListResponseDto>> getAllUsers() {
        return new ResponseEntity<>(receptionistService.getAllUsers(), HttpStatus.OK);
    }
    @GetMapping("get/notifications")
    public ResponseEntity<List<NotificationResponseDto>> getNotifications(){
        return new ResponseEntity<>(receptionistService.getNotifications(),HttpStatus.OK);
    }

    @PostMapping("change/status")
    public ResponseEntity<Void> changeStatus(@RequestBody long id){
        receptionistService.changeStatus(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
