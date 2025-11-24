
  package org.almasenaccion.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.UUID;

@Document(collection = "users")
public class User {
  @Size(max = 512)
  private String avatarUrl;

  @Id
  private String id;

  @NotBlank
  @Size(max = 100)
  private String firstName;

  @Size(max = 100)
  private String lastName;

  @Email
  @NotBlank
  @Size(max = 255)
  @Indexed(unique = true)
  private String email;

  @NotBlank
  @Size(min = 8, max = 255)
  private String passwordHash;

  @Pattern(regexp = "^[+0-9().\\s-]{7,20}$")
  @Size(max = 30)
  private String phone;

  @Size(max = 255)
  private String address;


  private Role role;

  private boolean enabled;

  private int failedLoginAttempts;

  private Instant accountLockedUntil;

  private Instant createdAt;

  private Instant updatedAt;

  public void initOnCreate() {
    this.id = UUID.randomUUID().toString();
    this.createdAt = Instant.now();
    this.updatedAt = this.createdAt;
    this.enabled = false;
    if (this.role == null) this.role = Role.VOLUNTARIO;
  }

  public void touch() {
    this.updatedAt = Instant.now();
  }

  public String getId() {
    return id;
  }

  public String getAvatarUrl() {
    return avatarUrl;
  }
  public void setAvatarUrl(String avatarUrl) {
    this.avatarUrl = avatarUrl;
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

  public Instant getAccountLockedUntil() {
    return accountLockedUntil;
  }

  public void setAccountLockedUntil(Instant accountLockedUntil) {
    this.accountLockedUntil = accountLockedUntil;
  }

  public Instant getCreatedAt() {
    return createdAt;
  }

  public Instant getUpdatedAt() {
    return updatedAt;
  }
}
