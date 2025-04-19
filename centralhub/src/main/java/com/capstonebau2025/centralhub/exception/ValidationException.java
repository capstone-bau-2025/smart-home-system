package com.capstonebau2025.centralhub.exception;

import org.springframework.http.HttpStatus;

public class ValidationException extends ApplicationException {
    public ValidationException(String message) {
        super(message, HttpStatus.BAD_REQUEST);
    }
}