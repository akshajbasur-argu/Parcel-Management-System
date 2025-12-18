package com.example.Parcel.Management.System.controller;

import com.example.Parcel.Management.System.dto.admin.UpdateStatusRequest;
import com.example.Parcel.Management.System.dto.common.NotificationResponseDto;
import com.example.Parcel.Management.System.dto.common.UserDetailResponseDto;
import com.example.Parcel.Management.System.dto.employee.NotificationRequestDto;
import com.example.Parcel.Management.System.dto.receptionist.ParcelResponseDto;
import com.example.Parcel.Management.System.entity.Notifications;
import com.example.Parcel.Management.System.entity.Status;
import com.example.Parcel.Management.System.service.impl.EmployeeServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(value = "http://localhost:4200")
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/employee")
@PreAuthorize("hasRole('EMPLOYEE')")
public class EmployeeController {


    private final EmployeeServiceImpl employeeService;

    @GetMapping("parcels")
    public ResponseEntity<List<ParcelResponseDto>> getAllParcels(@CookieValue(name = "accessToken") String token) {
        System.out.println(token);
        return new ResponseEntity<>(employeeService.getAllParcels(token), HttpStatus.OK);
    }
    @PostMapping("notification")
    public ResponseEntity<Void> submitResponse(@RequestBody NotificationRequestDto notificationResponse){
        System.out.println("Notification response"+notificationResponse);
        employeeService.submitResponse(notificationResponse.getId(),notificationResponse.getStatus(),notificationResponse.getSender());
       return ResponseEntity.ok().build();
    }
    @GetMapping("get/notifications")
    public ResponseEntity<List<NotificationResponseDto>> getNotifications(){
        System.out.println("inside get notifications");

        return new ResponseEntity<>(employeeService.getNotifications(),HttpStatus.OK);
    }
    @GetMapping("get/id")
    public ResponseEntity<Long> getId(){
        return new ResponseEntity<>(employeeService.getId(),HttpStatus.OK);
    }

    @PostMapping("updateParcel")
    public ResponseEntity<List<UserDetailResponseDto>> updateParcelStatus(
            @RequestBody List<UpdateStatusRequest> updates ){
        employeeService.updateParcelStatus(updates);

        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("parcelList")
    public Page<ParcelResponseDto> getPaginatedParcels(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) Status filter
    ){
        return employeeService.getPaginatedParcels(page,size,filter);
    }
}
