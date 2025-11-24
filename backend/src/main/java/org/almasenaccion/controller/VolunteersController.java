package org.almasenaccion.controller;

import org.almasenaccion.model.Role;
import org.almasenaccion.model.User;
import org.almasenaccion.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/volunteers")
public class VolunteersController {
  private final UserRepository users;

  public VolunteersController(UserRepository users) {
    this.users = users;
  }

  @GetMapping
  public ResponseEntity<List<Object>> list(@RequestParam(value = "q", required = false) String q) {
    List<User> all = users.findAll().stream().filter(u -> u.getRole() == Role.VOLUNTARIO).collect(Collectors.toList());
    if (q != null && !q.isBlank()) {
      String qq = q.toLowerCase();
      all = all.stream().filter(u -> (u.getFirstName() + " " + (u.getLastName() == null ? "" : u.getLastName()) + " " + u.getEmail() + " " + (u.getAddress() == null ? "" : u.getAddress())).toLowerCase().contains(qq)).collect(Collectors.toList());
    }
    List<Object> payload = all.stream().map(u -> java.util.Map.of(
      "id", u.getId(),
      "name", u.getFirstName() + (u.getLastName() != null ? (" " + u.getLastName()) : ""),
      "email", u.getEmail(),
      "address", u.getAddress()
    )).collect(Collectors.toList());
    return ResponseEntity.ok(payload);
  }
}
