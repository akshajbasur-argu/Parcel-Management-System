package com.example.Parcel.Management.System.exceptions;

import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;


public class ApiError {
    private String message;
    private HttpStatus httpStatus;
    private LocalDateTime timestamp;

    public ApiError(String message, HttpStatus httpStatus) {
        this.httpStatus = httpStatus;
        this.message = message;
        this.timestamp = LocalDateTime.now();

    }

    public HttpStatus getHttpStatus() {
        return httpStatus;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public String getMessage() {
        return message;
    }
}
