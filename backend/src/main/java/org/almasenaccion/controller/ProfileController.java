package org.almasenaccion.controller;

import org.almasenaccion.dto.UpdateProfileRequest;
import org.almasenaccion.model.User;
import org.almasenaccion.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/profile")
public class ProfileController {
  private final UserService userService;

  public ProfileController(UserService userService) {
    this.userService = userService;
  }

  @GetMapping("/me")
  public ResponseEntity<User> me(Authentication auth) {
    User u = userService.getByEmail(auth.getName());
    return ResponseEntity.ok(u);
  }

  @PutMapping("/me")
  public ResponseEntity<User> update(Authentication auth, @Validated @RequestBody UpdateProfileRequest req) {
    User u = userService.getByEmail(auth.getName());
    User updated = userService.updateProfile(u, req);
    return ResponseEntity.ok(updated);
  }
}
