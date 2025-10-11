package com.example.Parcel.Management.System.exceptions;

import com.example.Parcel.Management.System.controller.InvalidRequestHandlerController;

import org.slf4j.LoggerFactory;
import org.slf4j.Logger;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.MailException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.NoHandlerFoundException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(UsernameNotFoundException.class)
    public ResponseEntity<ApiError> usernameNotFoundException(UsernameNotFoundException ex) {
        ApiError apiError = new ApiError("Some Error Occured " + ex.getMessage(), HttpStatus.NOT_FOUND);
        return new ResponseEntity<>(apiError, apiError.getHttpStatus());
    }

    @ExceptionHandler(MailException.class)
    public ResponseEntity<ApiError> mailException(MailException ex) {
        ApiError apiError = new ApiError("Some Error Occured " + ex.getMessage(), HttpStatus.EXPECTATION_FAILED);
        return new ResponseEntity<>(apiError, apiError.getHttpStatus());
    }

    @ExceptionHandler(NoHandlerFoundException.class)
    public ResponseEntity<ApiError> noHandlerFoundException(NoHandlerFoundException ex) {
        ApiError apiError = new ApiError("Some Error Occured " + ex.getMessage(), HttpStatus.NOT_FOUND);
        return new ResponseEntity<>(apiError, apiError.getHttpStatus());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> methodArgumentNotValidException(MethodArgumentNotValidException ex) {
        ApiError apiError = new ApiError("Some Error Occured " + ex.getMessage(), HttpStatus.BAD_REQUEST);
        return new ResponseEntity<>(apiError, apiError.getHttpStatus());
    }

    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<ApiError> resourceNotFoundException(NoResourceFoundException ex) {
        ApiError apiError = new ApiError("Some Error Occured " + ex.getMessage(), HttpStatus.NOT_FOUND);
        return new ResponseEntity<>(apiError, apiError.getHttpStatus());
    }

//    @ExceptionHandler(InvalidRequestException.class)
//    public ResponseEntity<ApiError> invalidRequestException(InvalidRequestException ex) {
//        ApiError apiError = new ApiError("Some Error Occured " + ex.getMessage(), HttpStatus.CONFLICT);
//        return new ResponseEntity<>(apiError, apiError.getHttpStatus());
//    }

//    @ExceptionHandler(Exception.class)
//    public ResponseEntity<ApiError> allExceptions(Exception exception) {
//
//        exception.printStackTrace();
//        System.out.println(exception.getCause());
//        ApiError apiError = new ApiError("Some Error Occured " + exception.getMessage(), HttpStatus.I_AM_A_TEAPOT);
//        return new ResponseEntity<>(apiError, apiError.getHttpStatus());
//    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleAllExceptions(Exception ex) {
        final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);
        log.error("Unhandled exception caught by global handler"+ ex.getMessage());
        Map<String, Object> body = new HashMap<>();
        body.put("error", ex.getClass().getSimpleName());
        body.put("message", ex.getMessage());
        // optional: include stacktrace (only for debugging, remove in prod)
        StringWriter sw = new StringWriter();
        ex.printStackTrace(new PrintWriter(sw));
        body.put("stacktrace", sw.toString());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body);
    }
}

