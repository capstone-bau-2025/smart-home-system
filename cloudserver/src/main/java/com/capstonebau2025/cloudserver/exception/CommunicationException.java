package com.capstonebau2025.cloudserver.exception;

import org.springframework.http.HttpStatus;

public class CommunicationException extends ApplicationException {
    public CommunicationException(String message) {
        super(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}