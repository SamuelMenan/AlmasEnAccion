package org.almasenaccion.service;

import org.almasenaccion.dto.RegisterRequest;
import org.almasenaccion.model.Role;
import org.almasenaccion.model.User;
import org.almasenaccion.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class AuthServiceTest {

  @Autowired
  private AuthService authService;

  @Autowired
  private UserRepository users;

  @Test
  @Transactional
  void registerSetsDesiredRole() {
    RegisterRequest req = new RegisterRequest();
    req.setFirstName("Test");
    req.setLastName("User");
    req.setEmail("test-role@example.com");
    req.setPassword("password123");
    req.setRole(Role.COORDINADOR);

    authService.register(req);

    User saved = users.findByEmail("test-role@example.com").orElseThrow();
    assertEquals(Role.COORDINADOR, saved.getRole());
  }
}
