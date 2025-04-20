package com.capstonebau2025.cloudserver.exception;

import org.springframework.http.HttpStatus;

public class DeviceConnectionException extends ApplicationException {
    public DeviceConnectionException(String message) {
        super(message, HttpStatus.SERVICE_UNAVAILABLE);
    }
}