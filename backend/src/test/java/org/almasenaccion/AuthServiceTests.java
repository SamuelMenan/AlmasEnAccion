package org.almasenaccion;

import org.almasenaccion.dto.LoginRequest;
import org.almasenaccion.dto.RegisterRequest;
import org.almasenaccion.model.Role;
import org.almasenaccion.model.User;
import org.almasenaccion.repository.UserRepository;
import org.almasenaccion.service.AuthService;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.boot.autoconfigure.mongo.embedded.EmbeddedMongoAutoConfiguration;

@SpringBootTest
@ActiveProfiles("test")
public class AuthServiceTests {
  // Embedded MongoDB is auto-configured by Spring Boot with flapdoodle dependency

  @Autowired
  AuthService authService;
  @Autowired
  UserRepository userRepository;

  @Test
  void registrationCreatesDisabledUser() {
    userRepository.deleteAll();
    RegisterRequest r = new RegisterRequest();
    r.setFirstName("Ana");
    r.setEmail("ana@example.org");
    r.setPassword("password123");
    authService.register(r);
    User u = userRepository.findByEmail("ana@example.org").orElseThrow();
    Assertions.assertFalse(u.isEnabled());
    Assertions.assertEquals(Role.VOLUNTARIO, u.getRole());
  }

  @Test
  void lockAfterThreeAttempts() {
    userRepository.deleteAll();
    RegisterRequest r = new RegisterRequest();
    r.setFirstName("Luis");
    r.setEmail("luis@example.org");
    r.setPassword("secret456");
    authService.register(r);
    User u = userRepository.findByEmail("luis@example.org").orElseThrow();
    u.setEnabled(true);
    userRepository.save(u);
    LoginRequest lr = new LoginRequest();
    lr.setEmail("luis@example.org");
    lr.setPassword("bad");
    Assertions.assertThrows(IllegalStateException.class, () -> authService.login(lr));
    Assertions.assertThrows(IllegalStateException.class, () -> authService.login(lr));
    Assertions.assertThrows(IllegalStateException.class, () -> authService.login(lr));
    User updated = userRepository.findByEmail("luis@example.org").orElseThrow();
    Assertions.assertNotNull(updated.getAccountLockedUntil());
  }
}
