package com.example.Parcel.Management.System.aspect;

import com.example.Parcel.Management.System.Utils.AuthUtil;
import com.example.Parcel.Management.System.dto.admin.UserRoleUpdateDto;
import com.example.Parcel.Management.System.dto.receptionist.GenericAopDto;
import com.example.Parcel.Management.System.dto.receptionist.ParcelResponseDto;
import com.example.Parcel.Management.System.entity.LogData;
import com.example.Parcel.Management.System.entity.Role;
import com.example.Parcel.Management.System.repository.LogDataRepo;
import lombok.RequiredArgsConstructor;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Aspect
@Component
@RequiredArgsConstructor
public class LogAspect {

//    @Pointcut("execution(public * com.example.Parcel.Management.System.service.impl.ReceptionistService.createParcel(..))")
//    public void aspectForCreateParcelService() {}
//
//    @Pointcut("execution(* com.example.Parcel.Management.System.service.impl.ReceptionistService.validateOtp(..)")
//    public void aspectForValidateOtpService() {}
//
//    @Pointcut("execution(* com.example.Parcel.Management.System.service.impl.ReceptionistService.sendNotification(..)")
//    public void aspectForSendNotificationService() {}
//
//    @Pointcut("execution(* com.example.Parcel.Management.System.service.impl.ReceptionistService.resendOtp(..)")
//    public void aspectForResendOtpService() {}


//    @AfterReturning(pointcut = "aspectForCreateParcelService()", returning = "result")
//    public void afterReturning(JoinPoint joinPoint, ParcelResponseDto result) {
//        System.out.println("inside aop");
//        genericAopMethod(joinPoint,result.getEmployeeId(),Role.RECEPTIONIST,result.getReceptionistId(),"Parcel for "+result.getRecipientName()+" create successfully");
//
//    }


    private final LogDataRepo logDataRepo;
    private final AuthUtil authUtil;
    @AfterReturning(pointcut = "execution(public * com.example.Parcel.Management.System.service.impl.ReceptionistServiceImpl.createParcel(..)) || " +
            "execution(public * com.example.Parcel.Management.System.service.impl.ReceptionistServiceImpl.validateOtp(..)) || " +
            "execution(public * com.example.Parcel.Management.System.service.impl.ReceptionistServiceImpl.sendNotification(..)) || " +
            "execution(public * com.example.Parcel.Management.System.service.impl.ReceptionistServiceImpl.resendOtp(..)) || " +
            "execution(public * com.example.Parcel.Management.System.service.impl.UpdateRole.changeRole(..))",
            returning = "res")
    public void afterReturning(JoinPoint joinPoint, Object res) {
        long id =authUtil.getAuthorityId();
        if (res instanceof UserRoleUpdateDto result) {
            if (!result.getRole().name().equals(result.getOldRole().name()))
                genericAopMethod(joinPoint, result.getId(), Role.ADMIN, id
                        , "Successfully updated role from " + result.getOldRole() + " to " + result.getRole() + " for " + result.getName());
        } else if (res instanceof GenericAopDto result) {
            genericAopMethod(joinPoint, result.getEmployeeId(), Role.RECEPTIONIST, id
                    , "Executed " + joinPoint.getSignature().getName()
                            + "successfully for " + result.getRecipientName());
        } else if (res instanceof ParcelResponseDto result) {
            genericAopMethod(joinPoint, result.getEmployeeId(), Role.RECEPTIONIST, id
                    , "Parcel for " + result.getRecipientName() + " create successfully");
        }

    }

    private void genericAopMethod(JoinPoint joinPoint, long employeeid, Role role, long authorityId, String action) {
        logDataRepo.save(LogData.builder().action(action).authorityId(authorityId).role(role).employeeId(employeeid)
                .dateStamp(LocalDateTime.now()).build());
    }

}
