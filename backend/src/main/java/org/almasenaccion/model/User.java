package org.almasenaccion.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.UUID;

@Entity
@Table(name = "users", indexes = {
  @Index(name = "idx_users_email", columnList = "email", unique = true)
})
public class User {
  @Id
  @Column(name = "id", nullable = false, updatable = false)
  private UUID id;

  @NotBlank
  @Size(max = 100)
  @Column(name = "first_name", nullable = false)
  private String firstName;

  @Size(max = 100)
  @Column(name = "last_name")
  private String lastName;

  @Email
  @NotBlank
  @Size(max = 255)
  @Column(name = "email", nullable = false, unique = true)
  private String email;

  @NotBlank
  @Size(min = 8, max = 255)
  @Column(name = "password_hash", nullable = false)
  private String passwordHash;

  @Pattern(regexp = "^[+0-9().\\s-]{7,20}$")
  @Size(max = 30)
  @Column(name = "phone")
  private String phone;

  @Size(max = 255)
  @Column(name = "address")
  private String address;

  @Size(max = 500)
  @Column(name = "skills")
  private String skills;

  @Enumerated(EnumType.STRING)
  @Column(name = "role", nullable = false)
  private Role role;

  @Column(name = "enabled", nullable = false)
  private boolean enabled;

  @Column(name = "failed_login_attempts", nullable = false)
  private int failedLoginAttempts;

  @Column(name = "account_locked_until")
  private OffsetDateTime accountLockedUntil;

  @Column(name = "created_at", nullable = false, updatable = false)
  private Instant createdAt;

  @Column(name = "updated_at", nullable = false)
  private Instant updatedAt;

  @PrePersist
  void prePersist() {
    this.id = UUID.randomUUID();
    this.createdAt = Instant.now();
    this.updatedAt = this.createdAt;
    this.enabled = false;
    if (this.role == null) this.role = Role.VOLUNTARIO;
  }

  @PreUpdate
  void preUpdate() {
    this.updatedAt = Instant.now();
  }

  public UUID getId() {
    return id;
  }

  public String getFirstName() {
    return firstName;
  }

  public void setFirstName(String firstName) {
    this.firstName = firstName;
  }

  public String getLastName() {
    return lastName;
  }

  public void setLastName(String lastName) {
    this.lastName = lastName;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public String getPasswordHash() {
    return passwordHash;
  }

  public void setPasswordHash(String passwordHash) {
    this.passwordHash = passwordHash;
  }

  public String getPhone() {
    return phone;
  }

  public void setPhone(String phone) {
    this.phone = phone;
  }

  public String getAddress() {
    return address;
  }

  public void setAddress(String address) {
    this.address = address;
  }

  public String getSkills() {
    return skills;
  }

  public void setSkills(String skills) {
    this.skills = skills;
  }

  public Role getRole() {
    return role;
  }

  public void setRole(Role role) {
    this.role = role;
  }

  public boolean isEnabled() {
    return enabled;
  }

  public void setEnabled(boolean enabled) {
    this.enabled = enabled;
  }

  public int getFailedLoginAttempts() {
    return failedLoginAttempts;
  }

  public void setFailedLoginAttempts(int failedLoginAttempts) {
    this.failedLoginAttempts = failedLoginAttempts;
  }

  public OffsetDateTime getAccountLockedUntil() {
    return accountLockedUntil;
  }

  public void setAccountLockedUntil(OffsetDateTime accountLockedUntil) {
    this.accountLockedUntil = accountLockedUntil;
  }

  public Instant getCreatedAt() {
    return createdAt;
  }

  public Instant getUpdatedAt() {
    return updatedAt;
  }
}
