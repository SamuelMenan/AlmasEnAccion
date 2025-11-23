package org.almasenaccion.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.Instant;
import java.util.UUID;

@Document(collection = "verification_tokens")
public class VerificationToken {
  @Id
  private String id;

  @Indexed(unique = true)
  private String token;

  private String userId;

  private Instant expiresAt;

  private Instant createdAt;

  public void initOnCreate() {
    this.id = UUID.randomUUID().toString();
    this.createdAt = Instant.now();
  }

  public String getId() {
    return id;
  }

  public String getToken() {
    return token;
  }

  public void setToken(String token) {
    this.token = token;
  }

  public String getUserId() { return userId; }
  public void setUserId(String userId) { this.userId = userId; }

  public Instant getExpiresAt() {
    return expiresAt;
  }

  public void setExpiresAt(Instant expiresAt) {
    this.expiresAt = expiresAt;
  }

  public Instant getCreatedAt() {
    return createdAt;
  }
}
