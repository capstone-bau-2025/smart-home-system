package com.capstonebau2025.cloudserver.exception;

import org.springframework.http.HttpStatus;

public class AuthException extends ApplicationException {
    public AuthException(String message) {
        super(message, HttpStatus.UNAUTHORIZED);
    }
}
