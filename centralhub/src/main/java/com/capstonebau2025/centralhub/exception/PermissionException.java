package com.capstonebau2025.centralhub.exception;

import org.springframework.http.HttpStatus;

public class PermissionException extends ApplicationException {
    public PermissionException(String message) {
        super(message, HttpStatus.FORBIDDEN);
    }
}