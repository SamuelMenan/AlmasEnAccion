package org.almasenaccion.service;

import org.almasenaccion.dto.JwtResponse;
import org.almasenaccion.dto.LoginRequest;
import org.almasenaccion.dto.RegisterRequest;
import org.almasenaccion.model.Role;
import org.almasenaccion.model.User;
import org.almasenaccion.model.VerificationToken;
import org.almasenaccion.repository.UserRepository;
import org.almasenaccion.repository.VerificationTokenRepository;
import org.almasenaccion.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
public class AuthService {
  private final UserRepository users;
  private final VerificationTokenRepository tokens;
  private final PasswordEncoder encoder;
  private final JwtUtil jwtUtil;
  private final EmailService emailService;

  public AuthService(UserRepository users, VerificationTokenRepository tokens, PasswordEncoder encoder, JwtUtil jwtUtil, EmailService emailService) {
    this.users = users;
    this.tokens = tokens;
    this.encoder = encoder;
    this.jwtUtil = jwtUtil;
    this.emailService = emailService;
  }

  @Transactional
  public void register(RegisterRequest req) {
    if (users.existsByEmail(req.getEmail())) throw new IllegalStateException("Email ya registrado");
    User u = new User();
    u.setFirstName(req.getFirstName());
    u.setLastName(req.getLastName());
    u.setEmail(req.getEmail());
    u.setPasswordHash(encoder.encode(req.getPassword()));
    u.setPhone(req.getPhone());
    u.setAddress(req.getAddress());
    u.setSkills(req.getSkills());
    u.setRole(Role.VOLUNTARIO);
    u.initOnCreate();
    users.save(u);
    VerificationToken vt = new VerificationToken();
    vt.setToken(UUID.randomUUID().toString());
    vt.setUserId(u.getId());
    vt.setExpiresAt(Instant.now().plusSeconds(24 * 3600));
    vt.initOnCreate();
    tokens.save(vt);
    String verifyUrl = "/api/v1/auth/verify?token=" + vt.getToken();
    emailService.send(u.getEmail(), "Verificación de cuenta", "Usa el enlace para activar tu cuenta: " + verifyUrl);
  }

  @Transactional
  public void verify(String token) {
    Optional<VerificationToken> opt = tokens.findByToken(token);
    if (opt.isEmpty()) throw new IllegalStateException("Token inválido");
    VerificationToken vt = opt.get();
    if (vt.getExpiresAt().isBefore(Instant.now())) throw new IllegalStateException("Token expirado");
    User u = users.findById(vt.getUserId()).orElseThrow(() -> new IllegalStateException("Usuario no encontrado"));
    u.setEnabled(true);
    u.touch();
    users.save(u);
    tokens.delete(vt);
  }

  @Transactional(noRollbackFor = IllegalStateException.class)
  public JwtResponse login(LoginRequest req) {
    User u = users.findByEmail(req.getEmail()).orElseThrow(() -> new IllegalStateException("Credenciales inválidas"));
    if (!u.isEnabled()) throw new IllegalStateException("Cuenta no verificada");
    if (u.getAccountLockedUntil() != null && u.getAccountLockedUntil().isAfter(Instant.now())) throw new IllegalStateException("Cuenta bloqueada temporalmente");
    if (!encoder.matches(req.getPassword(), u.getPasswordHash())) {
      int attempts = u.getFailedLoginAttempts() + 1;
      u.setFailedLoginAttempts(attempts);
      if (attempts >= 3) {
        u.setAccountLockedUntil(Instant.now().plusSeconds(15 * 60));
        u.setFailedLoginAttempts(0);
      }
      users.save(u);
      throw new IllegalStateException("Credenciales inválidas");
    }
    u.setFailedLoginAttempts(0);
    u.setAccountLockedUntil(null);
    users.save(u);
    String token = jwtUtil.generate(u.getEmail(), Map.of("role", u.getRole().name()));
    return new JwtResponse(token, u.getRole().name());
  }
}
