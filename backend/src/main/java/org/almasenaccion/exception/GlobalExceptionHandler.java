package org.almasenaccion.exception;

import jakarta.validation.ConstraintViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.ServletWebRequest;
import java.time.Instant;

@ControllerAdvice
public class GlobalExceptionHandler {
  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<ApiError> handleValidation(MethodArgumentNotValidException ex, ServletWebRequest req) {
    String msg = ex.getBindingResult().getFieldErrors().stream().findFirst().map(e -> e.getField() + ": " + e.getDefaultMessage()).orElse("Validation error");
    ApiError error = new ApiError(Instant.now(), HttpStatus.BAD_REQUEST.value(), "Bad Request", msg, req.getRequest().getRequestURI());
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
  }

  @ExceptionHandler(ConstraintViolationException.class)
  public ResponseEntity<ApiError> handleConstraint(ConstraintViolationException ex, ServletWebRequest req) {
    ApiError error = new ApiError(Instant.now(), HttpStatus.BAD_REQUEST.value(), "Bad Request", ex.getMessage(), req.getRequest().getRequestURI());
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
  }

  @ExceptionHandler(IllegalStateException.class)
  public ResponseEntity<ApiError> handleIllegalState(IllegalStateException ex, ServletWebRequest req) {
    ApiError error = new ApiError(Instant.now(), HttpStatus.CONFLICT.value(), "Conflict", ex.getMessage(), req.getRequest().getRequestURI());
    return ResponseEntity.status(HttpStatus.CONFLICT).body(error);
  }

  @ExceptionHandler(RuntimeException.class)
  public ResponseEntity<ApiError> handleRuntime(RuntimeException ex, ServletWebRequest req) {
    HttpStatus status = ex.getMessage() != null && ex.getMessage().toLowerCase().contains("credenciales inválidas") ? HttpStatus.UNAUTHORIZED : HttpStatus.BAD_REQUEST;
    ApiError error = new ApiError(Instant.now(), status.value(), status.getReasonPhrase(), ex.getMessage(), req.getRequest().getRequestURI());
    return ResponseEntity.status(status).body(error);
  }
}
