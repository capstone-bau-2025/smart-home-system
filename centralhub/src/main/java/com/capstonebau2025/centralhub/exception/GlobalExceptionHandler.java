package com.capstonebau2025.centralhub.exception;

import com.capstonebau2025.centralhub.dto.ErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFoundException(
            ResourceNotFoundException ex, HttpServletRequest request) {
        return ResponseEntity
                .status(ex.getStatus())
                .body(createErrorResponse(ex, request, ex.getStatus().value()));
    }

    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<ErrorResponse> handleValidationException(
            ValidationException ex, HttpServletRequest request) {
        return ResponseEntity
                .status(ex.getStatus())
                .body(createErrorResponse(ex, request, ex.getStatus().value()));
    }

    @ExceptionHandler(DeviceConnectionException.class)
    public ResponseEntity<ErrorResponse> handleDeviceConnectionException(
            DeviceConnectionException ex, HttpServletRequest request) {
        return ResponseEntity
                .status(ex.getStatus())
                .body(createErrorResponse(ex, request, ex.getStatus().value()));
    }

    @ExceptionHandler(PermissionException.class)
    public ResponseEntity<ErrorResponse> handlePermissionException(
            PermissionException ex, HttpServletRequest request) {
        return ResponseEntity
                .status(ex.getStatus())
                .body(createErrorResponse(ex, request, ex.getStatus().value()));
    }

    @ExceptionHandler(CommunicationException.class)
    public ResponseEntity<ErrorResponse> handleCommunicationException(
            CommunicationException ex, HttpServletRequest request) {
        return ResponseEntity
                .status(ex.getStatus())
                .body(createErrorResponse(ex, request, ex.getStatus().value()));
    }

    @ExceptionHandler(ApplicationException.class)
    public ResponseEntity<ErrorResponse> handleApplicationException(
            ApplicationException ex, HttpServletRequest request) {
        return ResponseEntity
                .status(ex.getStatus())
                .body(createErrorResponse(ex, request, ex.getStatus().value()));
    }

    // Keep existing exception handlers
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorResponse> handleBadCredentialsException(
            BadCredentialsException ex, HttpServletRequest request) {
        return ResponseEntity
                .status(401)
                .body(createErrorResponse(ex, request, 401));
    }

    @ExceptionHandler(UsernameNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleUsernameNotFoundException(
            UsernameNotFoundException ex, HttpServletRequest request) {
        return ResponseEntity
                .status(404)
                .body(createErrorResponse(ex, request, 404));
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handleAccessDeniedException(
            AccessDeniedException ex, HttpServletRequest request) {
        return ResponseEntity
                .status(403)
                .body(createErrorResponse(ex, request, 403));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(
            Exception ex, HttpServletRequest request) {
        log.error(ex.getMessage(), ex);
        return ResponseEntity
                .status(500)
                .body(createErrorResponse(ex, request, 500));
    }

    private ErrorResponse createErrorResponse(Exception ex, HttpServletRequest request, int status) {
        return ErrorResponse.builder()
                .timestamp(LocalDateTime.now().toString())
                .status(status)
                .error(ex.getClass().getSimpleName())
                .message(ex.getMessage())
                .path(request.getRequestURI())
                .build();
    }
}