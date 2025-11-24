package org.almasenaccion.controller;

import org.almasenaccion.dto.JwtResponse;
import org.almasenaccion.dto.LoginRequest;
import org.almasenaccion.dto.RegisterRequest;
import org.almasenaccion.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {
  private final AuthService authService;

  public AuthController(AuthService authService) {
    this.authService = authService;
  }

  @PostMapping("/register")
  public ResponseEntity<Void> register(@Validated @RequestBody RegisterRequest req) {
    authService.register(req);
    return ResponseEntity.accepted().build();
  }

  @GetMapping("/verify")
  public ResponseEntity<String> verify(@RequestParam("token") String token) {
    authService.verify(token);
    return ResponseEntity.ok("Cuenta activada");
  }

  @PostMapping("/login")
  public ResponseEntity<JwtResponse> login(@Validated @RequestBody LoginRequest req) {
    JwtResponse resp = authService.login(req);
    return ResponseEntity.ok(resp);
  }
}
